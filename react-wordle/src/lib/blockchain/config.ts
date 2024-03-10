import { http, createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit';
import { zama } from './zama';

export const config = createConfig(
    getDefaultConfig({
        chains: [zama],
        transports: {
          [zama.id]: http(),
        },
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        appName: "FHEordle",
    })
)
