
const gameAbi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_playerAddr',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_relayerAddr',
          type: 'address',
        },
        {
          internalType: 'uint16',
          name: '_word1Id',
          type: 'uint16',
        },
        {
          internalType: 'bytes32',
          name: '_root',
          type: 'bytes32',
        },
        {
          internalType: 'uint16',
          name: '_wordSetSz',
          type: 'uint16',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'InvalidShortString',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'str',
          type: 'string',
        },
      ],
      name: 'StringTooLong',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [],
      name: 'EIP712DomainChanged',
      type: 'event',
    },
    {
      inputs: [],
      name: 'checkProof',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'guessN',
          type: 'uint8',
        },
      ],
      name: 'claimWin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'eip712Domain',
      outputs: [
        {
          internalType: 'bytes1',
          name: 'fields',
          type: 'bytes1',
        },
        {
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'version',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'chainId',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'verifyingContract',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'salt',
          type: 'bytes32',
        },
        {
          internalType: 'uint256[]',
          name: 'extensions',
          type: 'uint256[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'eqMaskGuess',
      outputs: [
        {
          internalType: 'euint8',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'gameStarted',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'guessN',
          type: 'uint8',
        },
        {
          internalType: 'bytes32',
          name: 'publicKey',
          type: 'bytes32',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
      ],
      name: 'getGuess',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'guessN',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: 'letterN',
          type: 'uint8',
        },
        {
          internalType: 'bytes32',
          name: 'publicKey',
          type: 'bytes32',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
      ],
      name: 'getLetterGuess',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'publicKey',
          type: 'bytes32',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
      ],
      name: 'getWord1Id',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes',
          name: 'el0',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el1',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el2',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el3',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el4',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'eMask',
          type: 'bytes',
        },
      ],
      name: 'guessWord1',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'euint16',
          name: 'l0',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l1',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l2',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l3',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l4',
          type: 'uint256',
        },
        {
          internalType: 'euint32',
          name: 'letterMask',
          type: 'uint256',
        },
      ],
      name: 'guessWord1',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'letterMaskGuess',
      outputs: [
        {
          internalType: 'euint32',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'letterMaskGuessHist',
      outputs: [
        {
          internalType: 'euint16',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'nGuesses',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'playerAddr',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'playerWon',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'proofChecked',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'relayerAddr',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'revealWord',
      outputs: [
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
        {
          internalType: 'uint16',
          name: '',
          type: 'uint16',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'revealWordAndStore',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'setWord1Id',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32[]',
          name: '_proof',
          type: 'bytes32[]',
        },
      ],
      name: 'submitProof',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes',
          name: 'el0',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el1',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el2',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el3',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'el4',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'eMask',
          type: 'bytes',
        },
      ],
      name: 'submitWord1',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'euint16',
          name: 'l0',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l1',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l2',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l3',
          type: 'uint256',
        },
        {
          internalType: 'euint16',
          name: 'l4',
          type: 'uint256',
        },
        {
          internalType: 'euint32',
          name: 'mask',
          type: 'uint256',
        },
      ],
      name: 'submitWord1',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'word1',
      outputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'word1Id',
      outputs: [
        {
          internalType: 'euint16',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'word1IdSet',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'word1Letters',
      outputs: [
        {
          internalType: 'euint16',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'word1LettersMask',
      outputs: [
        {
          internalType: 'euint32',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'wordSubmitted',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

export const gameAbi;