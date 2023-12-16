import { unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct'

export const getStatuses = (
  guesses: [string,number,number][]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}

  guesses.forEach((word) => {
    unicodeSplit(word[0]).forEach((letter, i) => {
      // if (!splitSolution.includes(letter)) {
        // make status absent
        // return (charObj[letter] = 'absent')
      // }

      // if (letter === splitSolution[i]) {
      //   //make status correct
      //   return (charObj[letter] = 'correct')
      // }

      // if (charObj[letter] !== 'correct') {
      //   //make status present
      //   return (charObj[letter] = 'present')
      // }
    })
  })

  return charObj
}

export const getGuessStatuses = (
  guess: [string, number, number]
): CharStatus[] => {
  const splitGuess = unicodeSplit(guess[0])

  const statuses: CharStatus[] = Array.from(Array(5))

  for (let i = 0; i < 5; i++) {
    if ((guess[1]>>i) & 1) {
      statuses[i] = 'correct';
    }
    else {
      let charNo = splitGuess[i].charCodeAt(0)-97;
      if ((guess[2]>>charNo) & 1)
        statuses[i] = 'present';
      else
        statuses[i] = 'absent';
    }
  }


  return statuses
}
