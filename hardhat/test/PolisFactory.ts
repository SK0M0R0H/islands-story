import hre, {ethers} from "hardhat";
import "@nomicfoundation/hardhat-ethers";
import { deployNilContract } from "../src/Utils";

const { expect } = require("chai");

// Map resources string to enum index
const ResourcesEnum: { [key: string]: number} = {
  "iron" : 0,
  "wood" : 1,
  "shardeum" : 2,
};

describe("PolisFactory contract", function () {
    let owner : any;
    const zero_address = "0x0000000000000000000000000000000000000000";

    beforeEach( async function () {
        //TODO: for now, it doesn't work with nil
        [owner] = await ethers.getSigners();
    });

    it("PolisFactory creates new instances of Polis with the given owner", async function () {
        // Set shardId
        hre.config.shardId = 1;

        // Deploy PolisFactory contract
        const { deployedContract: polisFactory, contractAddress: polisFactoryAddr } = await deployNilContract("PolisFactory", []);
        console.log("PolisFactory deployed at:", polisFactoryAddr);

        // Deploy Polis contracts
        await polisFactory.createChild();
        const polisAddr = await polisFactory.polisesAddr(0);
        const polis = await ethers.getContractAt("Polis", polisAddr);

        // Check the owner field
        // TODO: find a way to get signer address
        expect(await polis.owner()).to.not.equal(zero_address);
    });
});