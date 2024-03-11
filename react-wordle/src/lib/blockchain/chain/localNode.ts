import { type Chain } from 'viem';

export const localNode = {
    id: 9000,
    name: 'Local Network',
    nativeCurrency: {name: 'ZAMA', symbol: 'ZAMA', decimals: 18},
    rpcUrls: {
        default: {http: ['http://localhost:8545']}
    },
    blockExplorers: undefined,
} as const satisfies Chain;
