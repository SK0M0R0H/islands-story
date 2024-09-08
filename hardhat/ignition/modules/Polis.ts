const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("PolisModule", (m: any) => {
	const polis = m.contract("Polis");

	return { polis };
});