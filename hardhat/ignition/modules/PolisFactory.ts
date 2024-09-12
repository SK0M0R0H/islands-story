const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("PolisFactoryModule", (m: any) => {
	const polis = m.contract("PolisFactory");

	return { polis };
});