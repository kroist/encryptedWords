import { expect } from "chai";
import { ethers } from "hardhat";

import { getSigners } from "../signers";
import { FHEordle, FHEordleFactory, FHEordle__factory } from "../../types";
import { createTransaction } from "../utils";
import { createInstances } from "../instance";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { WORDS } from './wordslist';

export function genProofAndRoot(values: any, key: any) : [string, string[]] {
  const tree = StandardMerkleTree.of(values, ["uint16", "uint32"]);
  const root = tree.root;
  for (const [i, v] of tree.entries()) {
    if (v[0] == key) {
      const proof = tree.getProof(i);
      return [root, proof];
    }
  }
  return ["", []];
}

export const wordAtIdToNumber = (id: number) => {
  const word = WORDS[id];
  return (word.charCodeAt(0)-97)
    + (word.charCodeAt(1)-97) * 26
    + (word.charCodeAt(2)-97) * 26 * 26
    + (word.charCodeAt(3)-97) * 26 * 26 * 26
    + (word.charCodeAt(4)-97) * 26 * 26 * 26 * 26;
}
console.log(WORDS[3]);


describe("FHEordle", function() {
  before(async function () {
    this.signers = await getSigners(ethers);
  });

  it("should return correct masks", async function() {

    // word
    // 0 1 3 2 4
    // 0 + 1*26 + 3*26*26 + 2*26*26*26 + 4*26*26*26*26
    // 1865110
    // id = 3

    const wordsList = [];
    const wordsSz = WORDS.length;
    for (let i = 0; i < wordsSz; i++) {
      wordsList.push([i, wordAtIdToNumber(i)]);
    }
    // console.log(wordsList);
    // while (true) {
    // }
    const ourWord = wordsList[3][1];

    const [_root, proof] = genProofAndRoot(
      wordsList, 3
    );
    console.log(_root);
    console.log(wordsSz);

    const fheordleFactoryFactory = await ethers.getContractFactory("FHEordleFactory");
    const factoryContract: FHEordleFactory = await fheordleFactoryFactory.connect(this.signers.alice).deploy();
    await factoryContract.waitForDeployment();
    const txDeploy = await createTransaction(
      factoryContract.createTest, this.signers.bob.address
    );
    await txDeploy.wait();

    const testContractAddress = await factoryContract.userLastContract(this.signers.alice.address);
    const contract: FHEordle = FHEordle__factory.connect(testContractAddress).connect(this.signers.alice);
    
    this.contractAddress = await contract.getAddress();
    this.instances = await createInstances(this.contractAddress, ethers, this.signers);


    // get word id (Bob-Relayer)
    {
      const bobContract = contract.connect(this.signers.bob);
      const token = this.instances.bob.getTokenSignature(this.contractAddress)!;
      const tx1 = await bobContract.getWord1Id(token.publicKey, token.signature);
      const word1Id = this.instances.bob.decrypt(this.contractAddress, tx1);
      expect(word1Id).to.equal(3);
    }

    // submit word letters (Bob-Relayer)
    {
      const bobContract = contract.connect(this.signers.bob);
      const l0 = ourWord%26;
      const l1 = (ourWord/26)%26;
      const l2 = (ourWord/26/26)%26;
      const l3 = (ourWord/26/26/26)%26;
      const l4 = (ourWord/26/26/26/26)%26;
      const mask = (1<<l0) | (1<<l1) | (1<<l2) | (1<<l3) | (1<<l4);
      const encl0 = this.instances.bob.encrypt16(l0);
      const encl1 = this.instances.bob.encrypt16(l1);
      const encl2 = this.instances.bob.encrypt16(l2);
      const encl3 = this.instances.bob.encrypt16(l3);
      const encl4 = this.instances.bob.encrypt16(l4);
      const encMask = this.instances.bob.encrypt32(mask);
      const tx1 = await createTransaction(
        bobContract["submitWord1(bytes,bytes,bytes,bytes,bytes,bytes)"],
        encl0, encl1, encl2, encl3, encl4, encMask
      );
      await tx1.wait();
    }
    // submit proof
    {
      
      const bobContract = contract.connect(this.signers.bob);
      const tx1 = await createTransaction(
        bobContract.submitProof, proof
      );
      await tx1.wait();
    }

    {
      const gameStarted = await contract.gameStarted();
      expect(gameStarted);
    }

    //guess n.1
    {
      const l0 = 5;
      const l1 = 5;
      const l2 = 5;
      const l3 = 20;
      const l4 = 5;
      const mask = (1<<l0) | (1<<l1) | (1<<l2) | (1<<l3) | (1<<l4);
      const encl0 = this.instances.alice.encrypt16(l0);
      const encl1 = this.instances.alice.encrypt16(l1);
      const encl2 = this.instances.alice.encrypt16(l2);
      const encl3 = this.instances.alice.encrypt16(l3);
      const encl4 = this.instances.alice.encrypt16(l4);
      const encMask = this.instances.alice.encrypt32(mask);
      const tx1 = await createTransaction(
        contract["guessWord1(bytes,bytes,bytes,bytes,bytes,bytes)"],
        encl0, encl1, encl2, encl3, encl4, encMask
      );
      await tx1.wait();
    }

    //number of guesses
    {
      const nguess = await contract.nGuesses();
      expect(nguess).to.equal(1);
    }
    
    //check guess
    {
      const token = this.instances.alice.getTokenSignature(this.contractAddress)!;
      const tx1 = await contract.getGuess(0, token.publicKey, token.signature);
      const eqMask = this.instances.alice.decrypt(this.contractAddress, tx1[0]);
      const letterMask = this.instances.alice.decrypt(this.contractAddress, tx1[1]);
      expect(eqMask).to.equal(8);
      expect(letterMask).to.equal(1<<20);
    }

    // guess 2
    {
      const l0 = 0;
      const l1 = 1;
      const l2 = 14;
      const l3 = 20;
      const l4 = 19;
      const mask = (1<<l0) | (1<<l1) | (1<<l2) | (1<<l3) | (1<<l4);
      const encl0 = this.instances.alice.encrypt16(l0);
      const encl1 = this.instances.alice.encrypt16(l1);
      const encl2 = this.instances.alice.encrypt16(l2);
      const encl3 = this.instances.alice.encrypt16(l3);
      const encl4 = this.instances.alice.encrypt16(l4);
      const encMask = this.instances.alice.encrypt32(mask);
      const tx1 = await createTransaction(
        contract["guessWord1(bytes,bytes,bytes,bytes,bytes,bytes)"],
        encl0, encl1, encl2, encl3, encl4, encMask
      );
      await tx1.wait();
    }
    
    // number of guesses
    {
      const nguess = await contract.nGuesses();
      expect(nguess).to.equal(2);
    }

    // get guess
    {
      const token = this.instances.alice.getTokenSignature(this.contractAddress)!;
      const tx1 = await contract.getGuess(1, token.publicKey, token.signature);
      const eqMask = this.instances.alice.decrypt(this.contractAddress, tx1[0]);
      const letterMask = this.instances.alice.decrypt(this.contractAddress, tx1[1]);
      expect(eqMask).to.equal(31);
      expect(letterMask).to.equal(1589251);
    }

    // claim win
    {
      const tx1 = await createTransaction(
        contract.claimWin,
        1
      );
      await tx1.wait();
      const hasWon = await contract.playerWon();
      expect(hasWon);
    }

    // reveal word
    {
      const tx1 = await createTransaction(contract.revealWordAndStore);
      await tx1.wait();
      const word = await contract.word1();
      expect(word).to.equal(ourWord);
    }

    // check proof
    {
      const tx1 = await createTransaction(contract.checkProof);
      await tx1.wait();
      const proofChecked = await contract.proofChecked();
      expect(proofChecked);
    }

  }).timeout(180000);
  

});