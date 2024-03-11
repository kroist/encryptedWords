import { type Chain } from 'viem';

export const inco = {
    id: 9090,
    name: 'Inco Gentry Testnet',
    nativeCurrency: {name: 'INCO', symbol: 'INCO', decimals: 18},
    rpcUrls: {
        default: {http: ['Chain ID']}
    },
    blockExplorers: {
        default: { name: 'Zama Explorer', url: 'https://explorer.testnet.inco.org' },
    },
} as const satisfies Chain;
