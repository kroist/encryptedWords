// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.20;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "./FHEordle.sol";
import "fhevm/lib/TFHE.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract FHEordleFactory is EIP712WithModifier {
    address public creator;

    mapping(address => address) public userLastContract;

    mapping(address => uint32) public gamesWon;
    mapping(address => bool) public claimedWin;
    address private immutable implementation;

    constructor(address _implementation) EIP712WithModifier("Authorization token", "1") {
        creator = msg.sender;
        implementation = _implementation;
    }

    function createGame(address _relayerAddr, bytes32 salt) public {
        address cloneAdd = Clones.cloneDeterministic(implementation,salt);
        FHEordle(cloneAdd).initialize(
                msg.sender,
                _relayerAddr,
                0
        );
        userLastContract[msg.sender] = cloneAdd;
    }

    function createTest(address _relayerAddr, uint16 id, bytes32 salt) public {
        require(userLastContract[msg.sender] == address(0), "kek");
        address cloneAdd = Clones.cloneDeterministic(implementation,salt);
        FHEordle(cloneAdd).initialize(
                msg.sender,
                _relayerAddr,
                id
        );
        userLastContract[msg.sender] = cloneAdd;
    }

    function gameNotStarted() public view returns (bool) {
        if (userLastContract[msg.sender] != address(0)) {
            FHEordle game = FHEordle(userLastContract[msg.sender]);
            return game.playerWon() || (game.nGuesses() == 5);
        }
        return true;
    }

    function mint() public {
        if (userLastContract[msg.sender] != address(0)) {
            address contractAddr = userLastContract[msg.sender];
            FHEordle game = FHEordle(contractAddr);
            require(game.playerWon() && game.proofChecked() && !claimedWin[contractAddr], "has to win and check proof");
            claimedWin[contractAddr] = true;
            gamesWon[msg.sender] += 1;
        }
    }
}
