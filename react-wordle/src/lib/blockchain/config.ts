import { http, createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit';
import { zama } from './chain/zama';
import { inco } from './chain/inco';
import { localNode } from './chain/localNode';
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig(
    getDefaultConfig({
        chains: [
            inco,
            // zama,
            // localNode,
        ],
        transports: {
            [inco.id]: http(),
        //   [zama.id]: http(),
        //   [localNode.id]: http(),
        },
        walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID!,
        appName: "FHEordle",
    })
)
