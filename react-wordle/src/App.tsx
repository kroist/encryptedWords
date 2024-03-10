import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { useSDK } from '@metamask/sdk-react-ui'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
} from './constants/settings'
import {
  DISCOURAGE_INAPP_BROWSER_TEXT,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import {
  getGuesses,
  getIsGameStarted,
  guessWord,
  initFHE,
} from './lib/blockchain/blockchain'
import { isInAppBrowser } from './lib/browser'
import { getGuessStatuses } from './lib/statuses'
import {
  getGameDate,
  getIsLatestGame,
  isWordInWordList,
  solution,
  unicodeLength,
} from './lib/words'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { config } from './lib/blockchain/config'
import Game from './components/Game'

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <div>
            <Game />
          </div>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
//   const isLatestGame = getIsLatestGame()
//   const gameDate = getGameDate()
//   const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
//     useAlert()
//   const [isFhevmInitialized, setFhevmInitialized] = useState(false)
//   const [currentGuess, setCurrentGuess] = useState('')
//   const [isGameWon, setIsGameWon] = useState(false)
//   const [isGameStarted, setIsGameStarted] = useState(false)
//   const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
//   const [currentRowClass, setCurrentRowClass] = useState('')
//   const isRevealing = false
//   const [guesses, setGuesses] = useState<[string, number, number][]>(() => {
//     const arr: [string, number, number][] = []
//     return arr
//   })


//   const { provider } = useSDK()

//   useEffect(() => {
//     const changeChain = async () => {
//       try {
//         await provider?.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: '0x1F49' }],
//         })
//       } catch (switchError: any) {
//         // This error code indicates that the chain has not been added to MetaMask.
//         if (switchError.code === 4902) {
//           try {
//             await provider?.request({
//               method: 'wallet_addEthereumChain',
//               params: [
//                 {
//                   chainId: '0x1F49',
//                   chainName: 'Zama Network',
//                   rpcUrls: ['https://devnet.zama.ai'],
//                   blockExplorerUrls: ['https://main.explorer.zama.ai'],
//                   nativeCurrency: {
//                     decimals: 18,
//                     name: 'ZAMA',
//                     symbol: 'ZAMA',
//                   },
//                 },
//               ],
//             })
//           } catch (addError) {
//             // handle "add" error
//           }
//         }
//         // handle other "switch" errors
//       }
//     }
//     changeChain()
//   })

//   useEffect(() => {
//     console.log('HERE')
//     initFHE(provider!)
//       .then(() => {
//         console.log('INITED')
//         setFhevmInitialized(true)
//       })
//       .catch(() => setFhevmInitialized(false))
//   }, [provider])

//   useEffect(() => {
//     console.log('IS GAME STARTED')
//     getIsGameStarted().then((res) => {
//       console.log(res)
//       setIsGameStarted(res)
//     })
//   }, [isFhevmInitialized])

//   useEffect(() => {
//     if (isFhevmInitialized) {
//       getGuesses([]).then((curGuesses) => {
//         setGuesses(curGuesses)
//         if (curGuesses.length > 0) {
//           let statuses = getGuessStatuses(curGuesses.at(curGuesses.length - 1)!)
//           if (statuses.filter((val) => val === 'correct').length === 5) {
//             setIsGameWon(true)
//           }
//         }
//       })
//     }
//   }, [isFhevmInitialized])

//   useEffect(() => {
//     DISCOURAGE_INAPP_BROWSERS &&
//       isInAppBrowser() &&
//       showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
//         persist: false,
//         durationMs: 7000,
//       })
//   }, [showErrorAlert])

//   useEffect(() => {
//     document.documentElement.classList.remove('dark')
//     document.documentElement.classList.remove('high-contrast')
//   })

//   const clearCurrentRowClass = () => {
//     setCurrentRowClass('')
//   }

//   useEffect(() => {
//     if (isGameWon) {
//       const winMessage =
//         WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
//       const delayMs = REVEAL_TIME_MS * solution.length

//       showSuccessAlert(winMessage, {
//         delayMs
//       })
//     }

//   }, [isGameWon, showSuccessAlert])

//   const onChar = (value: string) => {
//     if (
//       unicodeLength(`${currentGuess}${value}`) <= solution.length &&
//       guesses.length < MAX_CHALLENGES &&
//       !isGameWon
//     ) {
//       setCurrentGuess(`${currentGuess}${value}`)
//     }
//   }

//   const onDelete = () => {
//     setCurrentGuess(
//       new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
//     )
//   }

//   const onEnter = async () => {
//     if (isGameWon) {
//       return
//     }

//     if (!(unicodeLength(currentGuess) === solution.length)) {
//       setCurrentRowClass('jiggle')
//       return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
//         onClose: clearCurrentRowClass,
//       })
//     }

//     if (!isWordInWordList(currentGuess)) {
//       setCurrentRowClass('jiggle')
//       return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
//         onClose: clearCurrentRowClass,
//       })
//     }

//     await guessWord(currentGuess)
//     const curGuesses = await getGuesses(guesses)
//     console.log('kek ', curGuesses)
//     setGuesses(curGuesses)
//     setCurrentGuess('')
//     let statuses = getGuessStatuses(curGuesses.at(curGuesses.length - 1)!)
//     if (statuses.filter((val) => val === 'correct').length === 5) {
//       setIsGameWon(true)
//     }
//   }

//   if (!isFhevmInitialized) return null

//   return (
//     <Div100vh>
//       <div className="flex h-full flex-col">
//         <Navbar
//           setIsInfoModalOpen={setIsInfoModalOpen}
//           setIsGameStarted={setIsGameStarted}
//           metamaskProvider={provider!}
//           isGameStarted={isGameStarted}
//           isGameWon={isGameWon}
//           guesses={guesses}
//         />

//         {!isLatestGame && (
//           <div className="flex items-center justify-center">
//             <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
//             <p className="text-base text-gray-600 dark:text-gray-300">
//               {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
//             </p>
//           </div>
//         )}

//         <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
//           {isGameStarted && (
//             <div>
//               <div className="flex grow flex-col justify-center pb-6 short:pb-2">
//                 <Grid
//                   guesses={guesses}
//                   currentGuess={currentGuess}
//                   isRevealing={isRevealing}
//                   currentRowClassName={currentRowClass}
//                 />
//               </div>
//               <Keyboard
//                 onChar={onChar}
//                 onDelete={onDelete}
//                 onEnter={onEnter}
//                 isRevealing={isRevealing}
//               />
//             </div>
//           )}
//           <p
//             style={{
//               textAlign: 'center',
//               marginTop: '30px',
//             }}
//           >
//             If you are not seeing some updates, refresh the page! The state is
//             fully saved on blockchain
//           </p>
//           <InfoModal
//             isOpen={isInfoModalOpen}
//             handleClose={() => setIsInfoModalOpen(false)}
//           />
//           <AlertContainer />
//         </div>
//       </div>
//     </Div100vh>
//   )
}

export default App
