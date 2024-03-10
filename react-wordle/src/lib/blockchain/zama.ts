import { type Chain } from 'viem';

export const zama = {
    id: 8009,
    name: 'Zama Network',
    nativeCurrency: {name: 'ZAMA', symbol: 'ZAMA', decimals: 18},
    rpcUrls: {
        default: {http: ['https://devnet.zama.ai']}
    },
    blockExplorers: {
        default: { name: 'Zama Explorer', url: 'https://main.explorer.zama.ai' },
    },
} as const satisfies Chain;
