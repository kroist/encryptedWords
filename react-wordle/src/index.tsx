import './index.css'

import { MetaMaskUIProvider } from '@metamask/sdk-react-ui'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { AlertProvider } from './context/AlertContext'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskUIProvider
      sdkOptions={{
        checkInstallationImmediately: true,
        // preferDesktop: true,
        dappMetadata: {
          name: 'Demo UI React App',
          url: process.env.GAME_URL,
        },
        // checkInstallationImmediately: true,
        // extensionOnly: true,
      }}
    >
      <AlertProvider>
        <App />
      </AlertProvider>
    </MetaMaskUIProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
