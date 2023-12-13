import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { getSigners } from "../test/signers";

task("task:deployFheordleFactory").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers = await getSigners(ethers);
  const fHEordleFactoryFactory = await ethers.getContractFactory("FHEordleFactory");
  const fHEordleFactory = await fHEordleFactoryFactory.connect(signers.alice).deploy();
  await fHEordleFactory.waitForDeployment();
  console.log("FHEordleFactory deployed to: ", await fHEordleFactory.getAddress());
});
