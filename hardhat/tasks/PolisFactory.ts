import { task, types, scope } from "hardhat/config";

const polisFactoryScope = scope("polisFactory", "PolisFactory interactions")

// Map resources string to enum index
const ResourcesEnum: { [key: string]: number} = {
  "iron" : 0,
  "wood" : 1,
  "shardeum" : 2,
};

polisFactoryScope.task("create-child", "Create a new Polis instance")
  .addParam("address", "The address of the PolisFactory")
  .setAction(async (taskArgs, hre) => {
    // Get the contract
    const PolisFactory = await hre.ethers.getContractFactory("PolisFactory");
    const polisFactory = PolisFactory.attach(taskArgs.address);

    // Call the function
    console.log("Creating new Polis instance...");
    const tx = await polisFactory.createChild();
    await tx.wait(0);

    // Get new polis address
    const polises = await polisFactory.getPolises();
    console.log("New Polis instance created at:", polises[polises.length - 1]);
});