// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./nil/Nil.sol";
import "./Polis.sol";

// TODO: looks like Clone Factory cannot be implemented at nil atm because of delegatecall issues with cross-shard calls
contract PolisFactory {
    address[] public polisesAddr;

    // we duplicate information about owners to reduce cross-shard communication
    mapping (address => address) public owners;

    event PolisCreated(address polisAddr);

    function createChild() public {
        bytes memory code = abi.encodePacked(type(Polis).creationCode, abi.encode(msg.sender));
        uint256 salt = polisesAddr.length;
        // TODO: randomize shardId
        address polisAddr = Nil.createAddress(1, code, salt);
        Nil.asyncCall(polisAddr, address(0), msg.sender, 0, 0, true, 0, abi.encodePacked(code, salt));

        // TODO: ensure that async call is successful
        polisesAddr.push(polisAddr);
        owners[msg.sender] = polisAddr;
        emit PolisCreated(polisAddr);
    }

    function whipeEverything() public {
        bytes memory temp;
        bool ok;
        for (uint i = 0; i < polisesAddr.length; i++) {
            (temp, ok) = Nil.awaitCall(
                polisesAddr[i],
                    abi.encodeWithSignature(
                    "whipeMe()")
            );
            require(ok == true, "One of polises cannot be wiped");
        }
    }

    function getPolises() public view returns (address[] memory) {
        return polisesAddr;
    }

    // TODO: define logic to find polis in the created by the factory
    function isValidPolis(address polisAddr) public view returns (bool) {
        return true;
    }
}