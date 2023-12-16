import { getGuessStatuses } from '../../lib/statuses'
import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  guess: [string, number, number]
  isRevealing?: boolean
}

export const CompletedRow = ({ guess, isRevealing }: Props) => {
  const statuses = getGuessStatuses(guess)
  const splitGuess = unicodeSplit(guess[0])

  return (
    <div className="mb-1 flex justify-center">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter.toUpperCase()}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
