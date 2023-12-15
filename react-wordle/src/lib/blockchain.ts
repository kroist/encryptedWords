import { AbiCoder, BrowserProvider, Contract } from "ethers";
import { initFhevm, createInstance, FhevmInstance } from "fhevmjs";
import { SDKProvider } from '@metamask/sdk';
import { wordAtIdToNumber } from "./words";
  
const factoryContractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
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
          "name": "_relayerAddr",
          "type": "address"
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
  ];
const contractAbi =
    [
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
              "name": "_word1Id",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "_root",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "_wordSetSz",
              "type": "uint16"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
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
          "inputs": [],
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "eqMaskGuess",
          "outputs": [
            {
              "internalType": "euint8",
              "name": "",
              "type": "uint256"
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
            },
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
          "name": "getGuess",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            },
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
            },
            {
              "internalType": "bytes",
              "name": "eMask",
              "type": "bytes"
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
              "internalType": "euint16",
              "name": "l0",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l1",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l2",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l3",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l4",
              "type": "uint256"
            },
            {
              "internalType": "euint32",
              "name": "letterMask",
              "type": "uint256"
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
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "letterMaskGuess",
          "outputs": [
            {
              "internalType": "euint32",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
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
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
            },
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
          "name": "revealWordAndStore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "setWord1Id",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32[]",
              "name": "_proof",
              "type": "bytes32[]"
            }
          ],
          "name": "submitProof",
          "outputs": [],
          "stateMutability": "nonpayable",
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
            },
            {
              "internalType": "bytes",
              "name": "eMask",
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
              "internalType": "euint16",
              "name": "l0",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l1",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l2",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l3",
              "type": "uint256"
            },
            {
              "internalType": "euint16",
              "name": "l4",
              "type": "uint256"
            },
            {
              "internalType": "euint32",
              "name": "mask",
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
          "name": "word1Id",
          "outputs": [
            {
              "internalType": "euint16",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "word1IdSet",
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
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "word1Letters",
          "outputs": [
            {
              "internalType": "euint16",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "word1LettersMask",
          "outputs": [
            {
              "internalType": "euint32",
              "name": "",
              "type": "uint256"
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
    ];

const relayerAddr = "0x95D095295182679a0187Ed1715BF636E770A3f3E";
const factoryContractAddr = "0xe3ca72d2C38555b2Cf2978e7b86EE11c8cE9D427";


let fhevmInstance: FhevmInstance;
let provider: BrowserProvider;

const createFhevmInstance = async () => {

    const network = await provider.getNetwork();
    const chainId = +network.chainId.toString();
    const ret = await provider.call({
        // fhe lib address, may need to be changed depending on network
        to: "0x000000000000000000000000000000000000005d",
        // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
        data: "0xd9d47bb001",
    });
    const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
    const publicKey = decoded[0];
    return createInstance({ chainId: chainId, publicKey });
};

export const initFHE = async (metamaskProvider: SDKProvider) => {
    provider = new BrowserProvider((metamaskProvider as any));
    await initFhevm(); // Load TFHE
    fhevmInstance = await createFhevmInstance();
}

export const getIsGameFinished = async () => {
    const signer = await provider.getSigner();
    let contract = new Contract(factoryContractAddr, factoryContractAbi, signer);
    let res: boolean = await contract.gameNotStarted();
    return res;
}

const getGameAddr = async () => {
    const signer = await provider.getSigner();
    const factoryContract = new Contract(factoryContractAddr, factoryContractAbi, signer);
    const contractAddr = await factoryContract.userLastContract(signer.address);
    return contractAddr;
}

const getGameContract = async () => {
    const signer = await provider.getSigner();
    const contractAddr = await getGameAddr();
    const contract = new Contract(contractAddr, contractAbi, signer);
    return contract;
}

export const getIsGameCreated = async () => {
    let contract = await getGameContract();
    console.log("got contract ", await contract.getAddress());
    let word1IdSet: boolean = await contract.word1IdSet();
    console.log("word1IdSet: ", word1IdSet);
    return word1IdSet;
}

export const startNewGame = async () => {
    const signer = await provider.getSigner();
    let factoryContract = new Contract(factoryContractAddr, factoryContractAbi, signer);
    {
        let tx = await factoryContract.createGame(signer.address, {
            gasLimit: 4000000,
        });
        console.log(tx);
        await tx.wait();
        console.log("game created");
    }

    let contract = await getGameContract();
    {
        let tx = await contract.setWord1Id({
            gasLimit: 4000000,
        });
        console.log(tx);
        await tx.wait();
        console.log("word1 id set");
    }

}

export const callRelayerForWord = async (metamaskProvider: SDKProvider) => {
    const signer = await provider.getSigner();
    let contract = await getGameContract();
    const contractAddress = await getGameAddr();
    const encryptedParam = fhevmInstance.generateToken({
        verifyingContract: contractAddress,
    });
    const params = [signer.address, JSON.stringify(encryptedParam.token)];
    // signer.signTypedData
    const signature = await signer.signTypedData(
        encryptedParam.token.domain,
        { Reencrypt: encryptedParam.token.types.Reencrypt }, // Need to remove EIP712Domain from types
        encryptedParam.token.message,
    );
    fhevmInstance.setTokenSignature(contractAddress, signature);

    const response = await contract.getWord1Id(encryptedParam.publicKey, signature);
    console.log(response);
    const word1Id: number = fhevmInstance.decrypt(contractAddress, response);
    console.log("word1Id: ", word1Id);

    let word1Number: number = wordAtIdToNumber(word1Id);
    const l0 = word1Number%26;
    const l1 = (word1Number/26)%26;
    const l2 = (word1Number/26/26)%26;
    const l3 = (word1Number/26/26/26)%26;
    const l4 = (word1Number/26/26/26/26)%26;
    const mask = (1<<l0) | (1<<l1) | (1<<l2) | (1<<l3) | (1<<l4);
    const encl0 = fhevmInstance.encrypt16(l0);
    const encl1 = fhevmInstance.encrypt16(l1);
    const encl2 = fhevmInstance.encrypt16(l2);
    const encl3 = fhevmInstance.encrypt16(l3);
    const encl4 = fhevmInstance.encrypt16(l4);
    const encMask = fhevmInstance.encrypt32(mask);

    {
        let tx = await contract.submitWord1(
            encl0, encl1, encl2, encl3, encl4,
            encMask,{
            gasLimit: 4000000,
        });
    }

}
