import { task, types, scope } from "hardhat/config";

const polisScope = scope("polis", "Polis interactions")

// Map resources string to enum index
const ResourcesEnum: { [key: string]: number} = {
  "iron" : 0,
  "wood" : 1,
  "shardeum" : 2,
};

polisScope.task("add-resources", "Add resourses to polis")
  .addParam("address", "The address of the Polis")
  .setAction(async (taskArgs, hre) => {
  // Get the contract
  const Polis = await hre.ethers.getContractFactory("Polis");
  const polis = Polis.attach(taskArgs.address);

  // Get the code at the specified address
  const code = await hre.ethers.provider.getCode(taskArgs.address);

  //Call the function
  console.log("Adding resources...");
  const tx = await polis.addResources();
  await tx.wait(0);

  // Fetch the new values
  const iron = await polis.resources(ResourcesEnum["iron"]);
  const wood = await polis.resources(ResourcesEnum["wood"]);
  const shardeum = await polis.resources(ResourcesEnum["shardeum"]);
  console.log(`Iron: ${iron}; Wood: ${wood}, Shardeum: ${shardeum}`);
});

polisScope.task("send-resources", "Send resources to other polis")
  .addParam("from", "The addres of the donor Polis")
  .addParam("to", "The address of the target Polis")
  .addParam("type", "Resource type: iron, wood, shardeum")
  .addParam("quantity", "How many resources should be sent")
  .setAction(async (taskArgs, hre) => {
    // Get the contract
    const Polis = await hre.ethers.getContractFactory("Polis");
    const polis = Polis.attach(taskArgs.from);

    const Recepient = await hre.ethers.getContractFactory("Polis");
    const recepient = Recepient.attach(taskArgs.to);

    // Fetch the old values
    let iron = await polis.resources(ResourcesEnum["iron"]);
    let wood = await polis.resources(ResourcesEnum["wood"]);
    let shardeum = await polis.resources(ResourcesEnum["shardeum"]);
    console.log(`Before sending (donor): Iron: ${iron}; Wood: ${wood}, Shardeum: ${shardeum}`);

    iron = await recepient.resources(ResourcesEnum["iron"]);
    wood = await recepient.resources(ResourcesEnum["wood"]);
    shardeum = await recepient.resources(ResourcesEnum["shardeum"]);
    console.log(`Before sending (recepient): Iron: ${iron}; Wood: ${wood}, Shardeum: ${shardeum}`);

    // Call the function
    console.log("Adding resources...");
    const tx = await polis.sendResources(taskArgs.to, ResourcesEnum[taskArgs.type], taskArgs.quantity);
    await tx.wait(0);

    // Fetch the new values
    iron = await polis.resources(ResourcesEnum["iron"]);
    wood = await polis.resources(ResourcesEnum["wood"]);
    shardeum = await polis.resources(ResourcesEnum["shardeum"]);
    console.log(`After sending (donor): Iron: ${iron}; Wood: ${wood}, Shardeum: ${shardeum}`);

    iron = await recepient.resources(ResourcesEnum["iron"]);
    wood = await recepient.resources(ResourcesEnum["wood"]);
    shardeum = await recepient.resources(ResourcesEnum["shardeum"]);
    console.log(`After sending (recepient): Iron: ${iron}; Wood: ${wood}, Shardeum: ${shardeum}`);
  });