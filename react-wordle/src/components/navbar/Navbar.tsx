import {
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { ConnectKitButton } from 'connectkit';
import { useEffect, useState } from 'react'

import { GAME_TITLE } from '../../constants/strings'
import { useAlert } from '../../context/AlertContext'
import {
  callRelayerForWord,
  claimWin,
  getIsGameClaimed,
  getIsGameCreated,
  getIsWordIdSet,
  getWinTokens,
  mintWinToken,
  revealWord,
  setId,
  startNewGame,
} from '../../lib/blockchain/blockchain'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
}: Props) => {
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()

  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex">
          <InformationCircleIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />
        </div>
        <p className="text-xl font-bold dark:text-white">{GAME_TITLE}</p>
        <div className="right-icons">
          <div>
            <ConnectKitButton />
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
