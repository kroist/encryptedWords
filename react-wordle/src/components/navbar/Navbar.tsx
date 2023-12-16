import {
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'

import { useEffect, useState } from 'react'
import { ENABLE_ARCHIVED_GAMES } from '../../constants/settings'
import { GAME_TITLE } from '../../constants/strings'
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { SDKProvider } from '@metamask/sdk';
import { 
  startNewGame, 
  callRelayerForWord,
  getIsGameCreated,
  getIsWordIdSet,
  setId,
  claimWin,
  getIsGameClaimed,
  mintWinToken,
  getWinTokens,
  revealWord
} from '../../lib/blockchain';
import { useAlert } from '../../context/AlertContext';

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsGameStarted: (value: boolean) => void
  metamaskProvider: SDKProvider
  isGameStarted: boolean
  isGameWon: boolean
  guesses: [string, number, number][]
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsGameStarted,
  metamaskProvider,
  isGameStarted,
  isGameWon,
  guesses,
}: Props) => {
  const [isFirstTxGameCreate, setIsFirstTxGameCreate] = useState(false);
  const [isSecondTxGameCreate, setIsSecondTxGameCreate] = useState(false);
  const [isGameCreated, setIsGameCreated] = useState(false);
  const [isWordIdSet, setIsWordIdSet] = useState(false);
  const [isGameClaimed, setIsGameClaimed] = useState(false);
  const [winTokens, setWinTokens] = useState(0);
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()

  useEffect(() => {
    getIsGameCreated().then(res => {
      setIsGameCreated(res);
    })
  })

  useEffect(() => {
    getIsWordIdSet().then(res => {
      setIsWordIdSet(res);
    })
  })

  useEffect(() => {
    getIsGameClaimed().then(res => {
      setIsGameClaimed(res);
    })
  })

  useEffect(() => {
    getWinTokens().then(res => {
      setWinTokens(res);
    })
  })
  
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
              const callFunc = async () => {
                if (isGameCreated && !isWordIdSet) {
                  setIsSecondTxGameCreate(true);
                  return setId()
                    .then(() => {
                      setIsSecondTxGameCreate(false);
                      setIsGameCreated(true);
                      setIsWordIdSet(true);
                      showSuccessAlert("Transaction 2 complete");
                      window.location.reload();
                    });
                }
                else {
                  setIsGameCreated(false);
                  setIsGameStarted(false);
                  setIsFirstTxGameCreate(true);
                  return startNewGame()
                    .then(() => {
                      showSuccessAlert("Transaction 1 complete");
                      setIsFirstTxGameCreate(false);
                      setIsSecondTxGameCreate(true);
                      return setId();
                    }).then(() => {
                      showSuccessAlert("Transaction 2 complete");
                      setIsSecondTxGameCreate(false);
                      setIsGameCreated(true);
                      setIsWordIdSet(true);
                      window.location.reload();
                    });
                }
              }
              callFunc()
              .then()
              .catch(err => {
                console.error(err);
                showErrorAlert("Caught Error: refresh the page");
              })
            }}
            style={
              {
                width:"140px",
                backgroundColor:"red",
                color:"white",
              }
            }
          >
            {isFirstTxGameCreate ? 
              "Wait for 1st tx" :
              isSecondTxGameCreate ? "Wait for 2nd tx" : (isGameCreated && !isWordIdSet) ? "Set word id" : "(Re)Start Game"
            }
          </button>
          {
            (isGameCreated && isWordIdSet && !isGameStarted) &&
            <button
              type="button"
              className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
              onClick={async () => {
                await callRelayerForWord(metamaskProvider);
                setIsGameStarted(true);
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
          {
            (isGameWon && !isGameClaimed) &&
            <button
              type="button"
              className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
              onClick={async () => {
                const callFunc = async () => {
                  return claimWin(guesses.length-1)
                    .then(() => {
                      showSuccessAlert("Claimed win");
                    });
                }
                callFunc()
                .then()
                .catch(err => {
                  console.error(err);
                  showErrorAlert("Caught Error: refresh the page");
                })
              }}
              style={
                {
                  width:"100px",
                  backgroundColor:"green",
                  color:"white",
                }
              }
            >
              Claim win
            </button>
          }
          {
            (isGameClaimed) &&
            <button
              type="button"
              className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
              onClick={async () => {
                await mintWinToken();
                showSuccessAlert("Claimed Token");
                let newWinTokens = await getWinTokens();
                setWinTokens(newWinTokens);
              }}
              style={
                {
                  width:"120px",
                  backgroundColor:"blue",
                  color:"white",
                }
              }
            >
              Get win token
            </button>
          }
          {
            (guesses.length === 5 && !isGameWon) &&
            <button
              type="button"
              className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
              onClick={async () => {
                let word: string = await revealWord();
                showSuccessAlert("Word: " + word.toUpperCase());
              }}
              style={
                {
                  width:"120px",
                  backgroundColor:"blue",
                  color:"white",
                }
              }
            >
              Reveal word
            </button>
          }
        </div>
        <p className="text-xl font-bold dark:text-white">{GAME_TITLE}</p>
        <div className="right-icons">
          <div>
            <p className="text-l font-bold dark:text-white">Games won: {winTokens}</p>
          </div>
          {/* <div>
            <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
          </div> */}
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
