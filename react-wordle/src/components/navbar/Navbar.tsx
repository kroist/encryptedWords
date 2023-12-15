import {
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'

import { ENABLE_ARCHIVED_GAMES } from '../../constants/settings'
import { GAME_TITLE } from '../../constants/strings'
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { SDKProvider } from '@metamask/sdk';
import { 
  startNewGame, 
  callRelayerForWord 
} from '../../lib/blockchain';

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsGameCreated: (value: boolean) => void
  metamaskProvider: SDKProvider
  isGameCreated: boolean
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsGameCreated,
  metamaskProvider,
  isGameCreated,
}: Props) => {
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex">
          <InformationCircleIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <button
            type="button"
            className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
            onClick={async () => {
              await startNewGame();
              setIsGameCreated(true);
            }}
            style={
              {
                width:"140px",
                backgroundColor:"red",
                color:"white",
              }
            }
          >
            (Re)Start Game
          </button>
          {
            isGameCreated &&
            <button
              type="button"
              className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
              onClick={async () => {
                await callRelayerForWord(metamaskProvider);
                setIsGameCreated(true);
              }}
              style={
                {
                  width:"90px",
                  backgroundColor:"blue",
                  color:"white",
                }
              }
            >
              Set word
            </button>
          }
        </div>
        <p className="text-xl font-bold dark:text-white">{GAME_TITLE}</p>
        <div className="right-icons">
          <div>
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
