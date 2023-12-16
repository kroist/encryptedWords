# FHEordle

Our favorite game, but having state on FHE blockchain!

## Repo

Repo includes smart contracts in `contracts`, tests in `test/fheordle` and frontend in `react-wordle`

## How it works

## Word generation

There are N available words $w_0, \dots, w_{N-1}$. Smart contract generates $0 < [x] \leq N$, indicating the index of a word. There are a few ways to get the word $[w_{x}]$. One might write a FHE circuit to get it. And one might use a trusted relayer, which will receive reencrypted $x$, find $w_x$ and submit $[w_x]$ to blockchain. The implementation in this repo "mocks" the call to such relayer because of deployment simplicity https://github.com/kroist/encryptedWords/blob/4a07d9d48fdc13e37661567a7169903fdd533523/react-wordle/src/lib/blockchain.ts#L937

## Word guessing

Assume that the player tries the word $v$. And the alphabet is $\Sigma = \\{a, b, \dots, z\\}$. We define a FHE function:

$$f(v, [w_x]) = (mask_{=}, mask_{\Sigma})$$

Where, $mask_{=} = \\{i \in [0..4] |  v(i) = w_x(i)  \\}$$

Where, $mask_{\Sigma} = \\{x \in \Sigma |  \exists_{i. j} v(i) = w_x(j) = x  \\}$

Player submits the word, which is compared to $w_x$ in FHE. Player receives $mask_{=}, mask_{\Sigma}$. The first mask is a set of positions of word's letters equal to the $w_x$. The second mask is a set of letters, which are in both of the words at the same time.

When the $mask_{=} = \\{0, 1, 2, 3, 4\\}$, the player has guessed the word. Otherwise we can find correct/existing/non-existing letters in word.

## Credits

- smart contracts were implemented using TFHE by zama https://github.com/zama-ai/fhevm
- frontend was cloned from https://github.com/cwackerfuss/react-wordle

