import { SDKProvider } from '@metamask/sdk'
import { Contract } from 'ethers'
import { providers, utils } from 'ethers'
import { FhevmInstance, createInstance, initFhevm } from 'fhevmjs/web'

import { numberToWord, wordAtIdToNumber } from './words'
import { hexlify, randomBytes } from 'ethers/lib/utils'
import { VALID_GUESSES } from '../constants/validGuesses'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'

const factoryContractAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_implementation",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ERC1167FailedCreateClone",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidShortString",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "StringTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EIP712DomainChanged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "claimedWin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_relayerAddr",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "createGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_relayerAddr",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "id",
        "type": "uint16"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      }
    ],
    "name": "createTest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [
      {
        "internalType": "bytes1",
        "name": "fields",
        "type": "bytes1"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifyingContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "extensions",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameNotStarted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "gamesWon",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userLastContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const contractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ECDSAInvalidSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "ECDSAInvalidSignatureLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "ECDSAInvalidSignatureS",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidShortString",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "StringTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EIP712DomainChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "checkProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "guessN",
        "type": "uint8"
      }
    ],
    "name": "claimWin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [
      {
        "internalType": "bytes1",
        "name": "fields",
        "type": "bytes1"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifyingContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "extensions",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameStarted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "guessN",
        "type": "uint8"
      }
    ],
    "name": "getGuess",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "getWord1Id",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "guessHist",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "word",
        "type": "uint32"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "guessWord1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_playerAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_relayerAddr",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "_testFlag",
        "type": "uint16"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nGuesses",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "playerAddr",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "playerWon",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proofChecked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "relayerAddr",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revealWord",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revealWordAndStore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "root",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rootAllowed",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "el0",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "el1",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "el2",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "el3",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "el4",
        "type": "bytes"
      }
    ],
    "name": "submitWord1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "euint8",
        "name": "l0",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "l1",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "l2",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "l3",
        "type": "uint256"
      },
      {
        "internalType": "euint8",
        "name": "l4",
        "type": "uint256"
      }
    ],
    "name": "submitWord1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "testFlag",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "word1",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wordSetSz",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wordSubmitted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// const relayerAddr = '0x95D095295182679a0187Ed1715BF636E770A3f3E'
const factoryContractAddr = '0x0c49810E0D2a5Ec91f15895f105c38e494A5d3Fc'

let fhevmInstance: FhevmInstance
let provider: providers.Web3Provider

const createFhevmInstance = async () => {
  const network = await provider.getNetwork()
  const chainId = +network.chainId.toString()
  const ret = await provider.call({
    // fhe lib address, may need to be changed depending on network
    to: '0x000000000000000000000000000000000000005d',
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: '0xd9d47bb001',
  })
  const decoded = utils.defaultAbiCoder.decode(['bytes'], ret)
  const publicKey = decoded[0]
  return createInstance({ chainId: chainId, publicKey })
}

export const initFHE = async (metamaskProvider: SDKProvider) => {
  provider = new providers.Web3Provider(metamaskProvider as any)
  // provider = new BrowserProvider((metamaskProvider as any));
  await initFhevm() // Load TFHE
  fhevmInstance = await createFhevmInstance()
}

const getGameAddr = async () => {
  try {
    const signer = await provider.getSigner()
    const factoryContract = new Contract(
      factoryContractAddr,
      factoryContractAbi,
      signer
    )
    const contractAddr = await factoryContract.userLastContract(
      await signer.getAddress()
    )
    return contractAddr
  } catch (err) {
    return '0x0000000000000000000000000000000000000000';
  }
}

const getGameContract = async () => {
  const signer = await provider.getSigner()
  const contractAddr = await getGameAddr()
  const contract = new Contract(contractAddr, contractAbi, signer)
  return contract
}

export const getIsGameCreated = async () => {
  if (await getGameAddr() == '0x0000000000000000000000000000000000000000') {
    return false;
  }
  const contract = await getGameContract()
  await contract.playerAddr()
  return true
}

export const getIsWordIdSet = async () => {
  // let contract = await getGameContract()
  // let word1IdSet: boolean = await contract.word1IdSet()
  // return word1IdSet
  return true
}

export const getIsGameStarted = async () => {
  if (await getGameAddr() == '0x0000000000000000000000000000000000000000') {
    return false;
  }
  let contract = await getGameContract()
  let gameStarted: boolean = await contract.gameStarted()
  return gameStarted
}

export const startNewGame = async () => {
  const signer = await provider.getSigner()
  let factoryContract = new Contract(
    factoryContractAddr,
    factoryContractAbi,
    signer
  )
  return factoryContract
    .createGame(await signer.getAddress(), hexlify(randomBytes(32)), {
      gasLimit: 4000000,
    })
    .then((tx: any) => {
      return tx.wait()
    })
    .then(() => {
      console.log('game created')
    })
}

export const setId = async () => {
  // let contract = await getGameContract()
  // return contract
  //   .setWord1Id({
  //     gasLimit: 4000000,
  //   })
  //   .then((tx: any) => {
  //     return tx.wait()
  //   })
  //   .then(() => {
      console.log('word1 id set')
  //   })
}

export const callRelayerForWord = async (metamaskProvider: SDKProvider) => {
  const signer = await provider.getSigner()
  let contract = await getGameContract()
  const contractAddress = await getGameAddr()
  const encryptedParam = fhevmInstance.generateToken({
    verifyingContract: contractAddress,
  })
  const signature = await signer._signTypedData(
    encryptedParam.token.domain,
    { Reencrypt: encryptedParam.token.types.Reencrypt }, // Need to remove EIP712Domain from types
    encryptedParam.token.message
  )
  // fhevmInstance.setTokenSignature(contractAddress, signature);

  const response = await contract.getWord1Id(
    encryptedParam.publicKey,
    signature
  )
  const word1Id: number = fhevmInstance.decrypt(contractAddress, response)
  console.log('word1Id: ', word1Id)

  let word1Number: number = wordAtIdToNumber(word1Id)
  const l0 = word1Number % 26
  const l1 = (word1Number / 26) % 26
  const l2 = (word1Number / 26 / 26) % 26
  const l3 = (word1Number / 26 / 26 / 26) % 26
  const l4 = (word1Number / 26 / 26 / 26 / 26) % 26
  const mask = (1 << l0) | (1 << l1) | (1 << l2) | (1 << l3) | (1 << l4)
  const encl0 = fhevmInstance.encrypt8(l0)
  const encl1 = fhevmInstance.encrypt8(l1)
  const encl2 = fhevmInstance.encrypt8(l2)
  const encl3 = fhevmInstance.encrypt8(l3)
  const encl4 = fhevmInstance.encrypt8(l4)

  {
    let tx = await contract['submitWord1(bytes,bytes,bytes,bytes,bytes)'](
      encl0,
      encl1,
      encl2,
      encl3,
      encl4,
      {
        gasLimit: 4000000,
      }
    )

    await tx.wait()
  }
}

export function genProofAndRoot(values: any, key: any, encoding: string[]): [string, string[]] {
  const tree = StandardMerkleTree.of(values, encoding);
  const root = tree.root;
  for (const [i, v] of tree.entries()) {
    if (v[1] == key[1]) {
      const proof = tree.getProof(i);
      return [root, proof];
    }
  }
  return ["", []];
}

export const wordToNumber = (word: string) => {
  return (
    word.charCodeAt(0) -
    97 +
    (word.charCodeAt(1) - 97) * 26 +
    (word.charCodeAt(2) - 97) * 26 * 26 +
    (word.charCodeAt(3) - 97) * 26 * 26 * 26 +
    (word.charCodeAt(4) - 97) * 26 * 26 * 26 * 26
  );
};

export const guessWord = async (word: string) => {
  word = word.toLowerCase()
  let contract = await getGameContract()
  const wordInt = wordToNumber(word);

  const validWordsList = [];
  for (let i = 0; i < VALID_GUESSES.length; i++) {
    validWordsList.push([0, wordToNumber(VALID_GUESSES[i])]);
  }
  const [_vR, proof] = genProofAndRoot(validWordsList, [0, wordInt], ["uint8", "uint32"]);
  contract.guessWord1(
    wordInt,
    proof,
    {
      gasLimit: 4000000,
    }
  ).then((tx: any) => {
    return tx.wait()
  })
}

let mySignature: {
  publicKey: Uint8Array
  signature: string
}

export const getGuesses = async (prevGuesses: [string, number, number][]) => {
  if (await getGameAddr() == '0x0000000000000000000000000000000000000000') {
    return [];
  }
  const signer = await provider.getSigner()
  let contract = await getGameContract()
  let contractAddress = await getGameAddr()
  if (!fhevmInstance.hasKeypair(contractAddress)) {
    const encryptedParam = fhevmInstance.generateToken({
      verifyingContract: contractAddress,
    })
    const signature = await signer._signTypedData(
      encryptedParam.token.domain,
      { Reencrypt: encryptedParam.token.types.Reencrypt }, // Need to remove EIP712Domain from types
      encryptedParam.token.message
    )
    mySignature = { publicKey: encryptedParam.publicKey, signature }
    fhevmInstance.setTokenSignature(contractAddress, signature)
    // mySignature = fhevmInstance.getTokenSignature(contractAddress)!;
  }
  const params = mySignature

  let guessesNumber: number = await contract.nGuesses()

  let res: [string, number, number][] = prevGuesses

  for (let i = prevGuesses.length; i < guessesNumber; i++) {
    const [eqMaskGuess, letterMaskGuess] = await contract.getGuess(
      i,
    );
    const word = await contract.guessHist(
      i,
    );
    res.push([numberToWord(word), eqMaskGuess, letterMaskGuess])
  }
  return res
}

export const claimWin = async (guessN: number) => {
  let contract = await getGameContract()
  return contract
    .claimWin(guessN, {
      gasLimit: 4000000,
    })
    .then((tx: any) => {
      return tx.wait()
    })
    .then(() => {})
}

export const getIsGameClaimed = async () => {
  if (await getGameAddr() == '0x0000000000000000000000000000000000000000') {
    return false;
  }
  const contract = await getGameContract()
  return await contract.playerWon()
}

export const mintWinToken = async () => {
  const signer = await provider.getSigner()
  const factoryContract = new Contract(
    factoryContractAddr,
    factoryContractAbi,
    signer
  )
  const tx = await factoryContract.mint()
  await tx.wait()
}

export const getWinTokens = async () => {
  const signer = await provider.getSigner()
  const factoryContract = new Contract(
    factoryContractAddr,
    factoryContractAbi,
    signer
  )
  return await factoryContract.gamesWon(await signer.getAddress())
}

export const revealWord = async () => {
  const contract = await getGameContract()
  const [l0, l1, l2, l3, l4] = await contract.revealWord()
  const wordNumber = l0 + 26 * (l1 + 26 * (l2 + 26 * (l3 + 26 * l4)))
  const word = numberToWord(wordNumber)
  return word
}
