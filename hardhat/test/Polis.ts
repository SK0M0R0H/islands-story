import hre from "hardhat";
import "@nomicfoundation/hardhat-ethers";
import { deployNilContract } from "../src/Utils";

const { expect } = require("chai");

// Map resources string to enum index
const ResourcesEnum: { [key: string]: number} = {
  "iron" : 0,
  "wood" : 1,
  "shardeum" : 2,
};

describe("Polis contract", function () {
  let polis1AddrString : string;
  let polis2AddrString : string;

  it("Deployment should initialize resources with 0", async function () {
    // Set shardId
    hre.config.shardId = 1;

    // Deploy polis contract
    const { deployedContract: polis1, contractAddress: polis1Addr } = await deployNilContract("Polis");
    polis1AddrString = polis1Addr;
    console.log("Polis deployed at:", polis1AddrString);

    // Get resources
    let iron = await polis1.resources(ResourcesEnum["iron"]);
    let wood = await polis1.resources(ResourcesEnum["wood"]);
    let shardeum = await polis1.resources(ResourcesEnum["shardeum"]);
    expect(iron).to.equal(0);
    expect(wood).to.equal(0);
    expect(shardeum).to.equal(0);
  });

  it("Contract is able to send resources", async function () {
    // Set shardId
    hre.config.shardId = 1;

    // Deploy Polis contract
    const { deployedContract: polis1, contractAddress: polis1Addr } = await deployNilContract("Polis");
    polis1AddrString = polis1Addr;
    console.log("Polis1 deployed at:", polis1AddrString);

    // Set shardId
    hre.config.shardId = 2;

    // Deploy Polis contract
    const { deployedContract: polis2, contractAddress: polis2Addr } = await deployNilContract("Polis");
    polis2AddrString = polis2Addr;
    console.log("Polis2 deployed at:", polis2AddrString);

    // Set shardId
    hre.config.shardId = 1;

    // Get resources
    let iron = await polis1.resources(ResourcesEnum["iron"]);
    let wood = await polis1.resources(ResourcesEnum["wood"]);
    let shardeum = await polis1.resources(ResourcesEnum["shardeum"]);
    expect(iron).to.equal(0);
    expect(wood).to.equal(0);
    expect(shardeum).to.equal(0);

    // Add resources to the contract
    console.log("Add resources to Polis1...");
    await polis1.addResources();

    // Get resources
    iron = await polis1.resources(ResourcesEnum["iron"]);
    wood = await polis1.resources(ResourcesEnum["wood"]);
    shardeum = await polis1.resources(ResourcesEnum["shardeum"]);
    expect(iron).to.equal(10);
    expect(wood).to.equal(20);
    expect(shardeum).to.equal(1);

    // Send resources
    console.log("Polis1 sends resources...");
    await polis1.sendResources(polis2Addr, 0, 5);

    // Check remaining resources at Polis1
    iron = await polis1.resources(ResourcesEnum["iron"]);
    wood = await polis1.resources(ResourcesEnum["wood"]);
    shardeum = await polis1.resources(ResourcesEnum["shardeum"]);
    expect(iron).to.equal(5);
    expect(wood).to.equal(20);
    expect(shardeum).to.equal(1);

    // Check new resources at Polis2
    iron = await polis2.resources(ResourcesEnum["iron"]);
    wood = await polis2.resources(ResourcesEnum["wood"]);
    shardeum = await polis2.resources(ResourcesEnum["shardeum"]);
    expect(iron).to.equal(5);
    expect(wood).to.equal(0);
    expect(shardeum).to.equal(0);

    // check relationships change
    const relationshipsBonusRecepient = 1;
    const relationshipsBonusSender = 2;
    const relationshipsRecepient = await polis2.relationships(polis1Addr);
    const relationshipsSender = await polis1.relationships(polis2Addr);
    expect(relationshipsRecepient).to.equal(relationshipsBonusSender);
    expect(relationshipsSender).to.equal(relationshipsBonusRecepient);
  });
});