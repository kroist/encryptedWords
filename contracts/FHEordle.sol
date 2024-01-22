// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity 0.8.19;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract FHEordle is EIP712WithModifier {
    address public playerAddr;
    address public relayerAddr;

    euint16 private word1Id;
    euint16[5] private word1Letters;
    euint32 private word1LettersMask;
    uint32 public word1;

    uint8 public nGuesses;
    uint32[5] public letterMaskGuess;
    uint32[5] public guessHist;

    bytes32 private root;
    bytes32 private rootAllowed;
    uint16 wordSetSz;

    bool public wordSubmitted;
    bool public gameStarted;
    bool public playerWon;
    bool public proofChecked;
    bool public word1IdSet;

    constructor(
        address _playerAddr,
        address _relayerAddr,
        uint16 _word1Id,
        bytes32 _root,
        bytes32 _rootAllowed,
        uint16 _wordSetSz
    ) EIP712WithModifier("Authorization token", "1") {
        relayerAddr = _relayerAddr;
        playerAddr = _playerAddr;
        word1IdSet = false;
        wordSetSz = _wordSetSz;
        if (_word1Id > 0) {
            word1IdSet = true;
            word1Id = TFHE.asEuint16(_word1Id);
        }
        word1LettersMask = TFHE.asEuint32(0);
        for (uint8 i = 0; i < 5; i++) {
            letterMaskGuess[i] = 0;
            guessHist[i] = 0;
        }
        nGuesses = 0;
        wordSubmitted = false;
        gameStarted = false;
        playerWon = false;
        proofChecked = false;
        root = _root;
        rootAllowed = _rootAllowed;
        word1 = 0;
    }

    function setWord1Id() public onlyPlayer {
        if (!word1IdSet) {
            word1IdSet = true;
            word1Id = TFHE.rem(TFHE.randEuint16(), wordSetSz);
        }
    }

    function getWord1Id(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) onlyRelayer returns (bytes memory) {
        return TFHE.reencrypt(word1Id, publicKey);
    }

    function submitWord1(
        bytes calldata el0,
        bytes calldata el1,
        bytes calldata el2,
        bytes calldata el3,
        bytes calldata el4
    ) public {
        submitWord1(
            TFHE.asEuint16(el0),
            TFHE.asEuint16(el1),
            TFHE.asEuint16(el2),
            TFHE.asEuint16(el3),
            TFHE.asEuint16(el4)
        );
    }

    function submitWord1(euint16 l0, euint16 l1, euint16 l2, euint16 l3, euint16 l4) public onlyRelayer {
        require(!wordSubmitted, "word submitted");
        word1Letters[0] = l0;
        word1Letters[1] = l1;
        word1Letters[2] = l2;
        word1Letters[3] = l3;
        word1Letters[4] = l4;
        word1LettersMask = 
            TFHE.or(
                TFHE.shl(1, TFHE.asEuint32(word1Letters[0])),
                TFHE.or(
                    TFHE.shl(1, TFHE.asEuint32(word1Letters[1])),
                    TFHE.or(
                        TFHE.shl(1, TFHE.asEuint32(word1Letters[2])),
                        TFHE.or(
                            TFHE.shl(1, TFHE.asEuint32(word1Letters[3])), 
                            TFHE.shl(1, TFHE.asEuint32(word1Letters[4]))
                        )
                    )
                )
            );
        wordSubmitted = true;
        gameStarted = true;
    }

    function guessWord1(
        uint32 word,
        bytes32[] calldata proof
    ) public onlyPlayer {
        require(gameStarted, "game not started");
        require(nGuesses < 5, "cannot exceed five guesses!");

        uint8 zeroIndex = 0;
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(zeroIndex, word))));
        require(MerkleProof.verify(proof, rootAllowed, leaf), "Invalid word");
        uint32 l0 = (word) % 26;
        uint32 l1 = (word/26) % 26;
        uint32 l2 = (word/26/26) % 26;
        uint32 l3 = (word/26/26/26) % 26;
        uint32 l4 = (word/26/26/26/26) % 26;
        uint32 base = 1;
        uint32 letterMask = (base<<l0)|(base<<l1)|(base<<l2)|(base<<l3)|(base<<l4);
        letterMaskGuess[nGuesses] = TFHE.decrypt(TFHE.and(word1LettersMask, TFHE.asEuint32(letterMask)));
        guessHist[nGuesses] = word;
        nGuesses += 1;
    }

    function getEqMask(
        uint8 guessN 
    ) internal view returns (euint8) {
        uint32 word = guessHist[guessN];
        uint16 l0 = uint16((word) % 26);
        uint16 l1 = uint16((word/26) % 26);
        uint16 l2 = uint16((word/26/26) % 26);
        uint16 l3 = uint16((word/26/26/26) % 26);
        uint16 l4 = uint16((word/26/26/26/26) % 26);
        euint8 g0 = TFHE.asEuint8(TFHE.eq(word1Letters[0], l0));
        euint8 g1 = TFHE.asEuint8(TFHE.eq(word1Letters[1], l1));
        euint8 g2 = TFHE.asEuint8(TFHE.eq(word1Letters[2], l2));
        euint8 g3 = TFHE.asEuint8(TFHE.eq(word1Letters[3], l3));
        euint8 g4 = TFHE.asEuint8(TFHE.eq(word1Letters[4], l4));
        euint8 eqMask = TFHE.or(
            TFHE.shl(g0, 0),
            TFHE.or(TFHE.shl(g1, 1), TFHE.or(TFHE.shl(g2, 2), TFHE.or(TFHE.shl(g3, 3), TFHE.shl(g4, 4))))
        );
        return eqMask;
    }

    function getGuess(
        uint8 guessN
    ) public view onlyPlayer returns (uint8) {
        require(guessN < nGuesses, "canno exceed nGuesses");
        euint8 eqMask = getEqMask(guessN);
        return (TFHE.decrypt(eqMask));
    }

    function claimWin(uint8 guessN) public onlyPlayer {
        euint8 fullMask = TFHE.asEuint8(31);
        bool compare = TFHE.decrypt(TFHE.eq(fullMask, getEqMask(guessN)));
        if (compare) {
            playerWon = true;
        }
    }

    function revealWord() public view onlyPlayer returns (uint16, uint16, uint16, uint16, uint16) {
        assert(nGuesses == 5 || playerWon);
        uint16 l0 = TFHE.decrypt(word1Letters[0]);
        uint16 l1 = TFHE.decrypt(word1Letters[1]);
        uint16 l2 = TFHE.decrypt(word1Letters[2]);
        uint16 l3 = TFHE.decrypt(word1Letters[3]);
        uint16 l4 = TFHE.decrypt(word1Letters[4]);
        return (l0, l1, l2, l3, l4);
    }

    function revealWordAndStore() public onlyPlayer {
        uint16 l0;
        uint16 l1;
        uint16 l2;
        uint16 l3;
        uint16 l4;
        (l0, l1, l2, l3, l4) = revealWord();
        word1 =
            uint32(l0) +
            uint32(l1) *
            26 +
            uint32(l2) *
            26 *
            26 +
            uint32(l3) *
            26 *
            26 *
            26 +
            uint32(l4) *
            26 *
            26 *
            26 *
            26;
    }

    function checkProof(bytes32[] calldata proof) public onlyRelayer {
        assert(nGuesses == 5 || playerWon);
        uint16 wordId = TFHE.decrypt(word1Id);
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(wordId, word1))));
        if (MerkleProof.verify(proof, root, leaf)) {
            proofChecked = true;
        }
    }

    modifier onlyRelayer() {
        require(msg.sender == relayerAddr);
        _;
    }

    modifier onlyPlayer() {
        require(msg.sender == playerAddr);
        _;
    }
}
