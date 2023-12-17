# FHEordle

Our favorite game, but having state on FHE blockchain!

## Repo

Repo includes smart contracts in `contracts`, full game integration tests in `test/fheordle` and game ui in `react-wordle`

## How it works

## Original Wordle Game

The original game without FHE can be described as follows:

There is a set of valid words $S_{valid}$ and a set of playable words $S_{playable}$.

1. Browser chooses a secret word $w$ from $S_{playable}$.
2. Player enters some word $v = c_1 c_2 c_3 c_4 c_5$.
3. Browser checks if $v \in S_{valid}$ and if it is, compares it with $w$ character by character.
4. Player gets statuses for each character $c_i$.
   e.g if $w = rebus$ and $v = rules$, player will get statues ${\color{green}\textsf{c}}$ ${\color{orange}\textsf{e}}$ ${\color{grey}\textsf{a}}$ ${\color{orange}\textsf{e}}$ ${\color{green}\textsf{c}}$, where ${\color{green}\textsf{c}}$ means correct, ${\color{orange}\textsf{e}}$ means character exists in word, ${\color{grey}\textsf{a}}$ means character is absent in word.
6. The game finishes when player has no more tries or when player guesses the word $w$ (all the statues are ${\color{green}\textsf{c}}$)

Now let's dive into FHE implementation of the game

## FHE game

For sake of simplicity, let's define $[x]$ as encrypted value of some $x$.

### Word generation

There are N publically available words $w_0, \dots, w_{N-1}$ from set $S_{playable}$. Smart contract generates $0 < [x] \leq N$, indicating the index of a word. There are a few ways to get the encrypted word at encrypted index $[w_{x}]$:
#### Fully-trustless solution
One might write a FHE circuit to get the word $[w_x]$ from the set of encrypted words using encrypted index $[x]$ as input (which would be very costly at the time of writing).
#### Trusted relayer
One might use a trusted relayer, which will receive reencrypted index $x$, find $w_x$, ecnrypt it and submit $[w_x]$ to blockchain. 

The implementation in this repo uses trusted relayer option and "mocks" the call to such relayer because the main goal is to show proof-of-concept of the game https://github.com/kroist/encryptedWords/blob/4a07d9d48fdc13e37661567a7169903fdd533523/react-wordle/src/lib/blockchain.ts#L937

### Word guessing

Assume that the player tries the word $v$. And the alphabet is $\Sigma = \\{a, b, \dots, z\\}$. We define a FHE function:

$$f(v, [w_x]) = (mask_{=}, mask_{\Sigma})$$

Where, $mask_{=} = \\{i \in [0..4] |  v(i) = w_x(i)  \\}$$

Where, $mask_{\Sigma} = \\{x \in \Sigma |  \exists_{i. j} v(i) = w_x(j) = x  \\}$

Player submits the word, which is compared to $w_x$ in FHE. Player receives $mask_{=}, mask_{\Sigma}$. The first mask is a set of positions of word's letters equal to the $w_x$. The second mask is a set of letters, which are in both of the words at the same time.

When the $mask_{=} = \\{0, 1, 2, 3, 4\\}$, the player has guessed the word. Otherwise we can deduce correct/existing/absent characters in word easily.

### Validity of words

In the original game, the secret word $w_{x}$ has to be from the set $S_{playable}$. If we use relayer for word submission, we have to trust it with choosing the valid word.

However, it is easy to make the word submission trustless by requiring relayer to submit Merkle proof of inclusion of word into the set. Such functionality is implemented, by default turned off for better UX in frontend.

Because of the nature of the game, proof can be checked only in the end of the game, when the word is revealed.

## Dive into the implementation

### Contracts

#### Factory contract

The contract which needs to be deployed is `contracts/FHEordleFactory.sol`

It provides public methods 

- `createGame` - creates a new game contract
- `mint` - increments the number of won games if the player wins
- `gamesWon` - mapping returning number of won games for a player

#### Game contract

The contract is `contracts/FHEordle.sol`

public methods:

- `setWord1Id` - sets the secret id of word $[x]$
- `getWord1Id` - **available only to relayer** - get the reencrypted word id $x$
- `submitWord1` - **available only to relayer** - set the secret word $[w_x]$
- `guessWord1` - player sends the word $v$ to contract
- `getGuess` - player gets $mask_{=}, mask_{\Sigma}$ about previous guess
- `getLetterGuess` - util method, get the letters of previous guesses from the history
- `claimWin` - player has guessed the word and marks the game as won
- `revealWord` - the game has ended and the secret word $w_{x}$ is revealed

Methods that are available but not currently used:
- `submitProof` - relayer submits a merkle proof of inclusion of $w_{x}$, where $x$ is secret it in merkle tree of the set $S_{playable}$
- `checkProof` - $x$ and $w_{x}$ are revealed and proof is checked



### UI

UI signs/sends transaction using Metamask SDK.

Contract calls are written in `react-wordle/src/lib/blockchain.ts`

## Further development considerations

### Usage of real private relayer

As mentioned earlier, for the sake of simplicity and PoC nature of the project, relayer program was not implemented and UI client acts like a relayer itself, therefore leaking the encrypted word.

Private relayer implementation could be as simple as an API calling a two smart contract functions `getWord1Id`,`submitWord1`.

Or it can have more secure design.

### Validity of words

With further development of FHE SNARK's, it would be easy to verify computation on FHE public inputs, making merkle tree proofs be available to check immediately, not at the end of the game.

## Credits

- smart contracts were implemented using TFHE by zama https://github.com/zama-ai/fhevm
- frontend was cloned from https://github.com/cwackerfuss/react-wordle

