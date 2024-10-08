const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// biome-ignore lint: type is not exported
module.exports = buildModule("PolisModule", (m: any) => {
	const polis = m.contract("Polis", ["0x0000000000000000000000000000000000000000"]);

	return { polis };
});