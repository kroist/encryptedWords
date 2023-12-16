import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the word in 5 tries. After each guess, the color of the tiles will
        change to show how close your guess was to the word.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="W"
          status="correct"
        />
        <Cell value="E" isCompleted={true} />
        <Cell value="A" isCompleted={true} />
        <Cell value="R" isCompleted={true} />
        <Cell value="Y" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter W is in the word and in the correct spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="P" isCompleted={true} />
        <Cell value="I" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="L"
          status="present"
        />
        <Cell value="O" isCompleted={true} />
        <Cell value="T" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter L is in the word but in the wrong spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="V" isCompleted={true} />
        <Cell value="A" isCompleted={true} />
        <Cell value="G" isCompleted={true} />
        <Cell isRevealing={true} isCompleted={true} value="U" status="absent" />
        <Cell value="E" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter U is not in the word in any spot.
      </p>
      <p className="text-m text-gray-1000 dark:text-gray-300" style={{
        marginTop: "15px"
      }}>Controls:</p>
      <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-300">
        <button
            type="button"
            className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
            onClick={async () => {}}
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
        <p>to start/restart game (2 transactions)</p>
        <button
          type="button"
          className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
          onClick={async () => {}}
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
        <p>to set the secret word (call to relayer)</p>
        <button
          type="button"
          className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
          onClick={async () => {}}
          style={
            {
              width:"90px",
              backgroundColor:"green",
              color:"white",
            }
          }
        >
          Claim win
        </button>
        <p>to check if you won</p>
        <button
          type="button"
          className="ml-3 h-6 w-6 cursor-pointer dark:stroke-white mybutton"
          onClick={async () => {}}
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
        <p>update your score</p>
      </p>
      
    </BaseModal>
  )
}
