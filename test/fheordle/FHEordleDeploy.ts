import { expect } from "chai";
import { ethers } from "hardhat";

import { getSigners } from "../signers";
import { FHEordle, FHEordleFactory, FHEordle__factory } from "../../types";
import { createTransaction } from "../utils";
import { createInstances } from "../instance";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

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



describe("FHEordle", function() {
    before(async function () {
      this.signers = await getSigners(ethers);
    });
  
    it("should deploy the game correctly", async function() {

    // word
    // 0 1 3 2 4
    // 0 + 1*26 + 3*26*26 + 2*26*26*26 + 4*26*26*26*26
    // 1865110
    // id = 3

    const [_root, proof] = genProofAndRoot(
      [[4, 610123],
      [3, 1865110],
      [5, 3141341]], 3
    );

    const fheordleFactoryFactory = await ethers.getContractFactory("FHEordleFactory");
    const factoryContract: FHEordleFactory = await fheordleFactoryFactory.connect(this.signers.alice).deploy();
    await factoryContract.waitForDeployment();
    const txDeploy = await createTransaction(
      factoryContract.createGame, this.signers.bob.address
    );
    await txDeploy.wait();

    const testContractAddress = await factoryContract.userLastContract(this.signers.alice.address);
    console.log(testContractAddress);
    const contract: FHEordle = FHEordle__factory.connect(testContractAddress).connect(this.signers.alice);

    this.contractAddress = await contract.getAddress();
    this.instances = await createInstances(this.contractAddress, ethers, this.signers);

    {
        const tx1 = await createTransaction(contract.setWord1Id);
        await tx1.wait();
    }

    // get word id (Bob-Relayer)
    {
      const bobContract = contract.connect(this.signers.bob);
      const token = this.instances.bob.getTokenSignature(this.contractAddress)!;
      const tx1 = await bobContract.getWord1Id(token.publicKey, token.signature);
      const word1Id = this.instances.bob.decrypt(this.contractAddress, tx1);
      expect(word1Id).to.equal(3);
    }

    }).timeout(80000);

});