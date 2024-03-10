import Div100vh from "react-div-100vh";
import { AlertContainer } from "./alerts/AlertContainer";
import { InfoModal } from "./modals/InfoModal";
import { useState } from "react";
import { Navbar } from "./navbar/Navbar";
import { useAccount } from "wagmi";

function Game() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
        / >
        {
          isConnected ?
          <p
            style={{
              textAlign: 'center',
              marginTop: '30px',
            }}
          >
            Game should be started
          </p>
          :
          <p
            style={{
              textAlign: 'center',
              marginTop: '30px',
            }}
          >
            Connect your wallet to play!
          </p>
        }
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <AlertContainer />
      </div>
    </Div100vh>
  )
}

export default Game