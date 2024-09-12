// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./nil/Nil.sol";

enum ResourceType {
    Iron,
    Wood,
    Shardeum
}

contract Polis is NilBase {
    using Nil for address;

    address public owner;

    mapping (ResourceType => uint256) public resources;
    mapping (address => uint256) public relationships;

    constructor(address _owner) {
        resources[ResourceType.Iron] = 0;
        resources[ResourceType.Wood] = 0;
        resources[ResourceType.Shardeum] = 0;
        owner = _owner;
    }

    function addResources() public {
        resources[ResourceType.Iron] += 10;
        resources[ResourceType.Wood] += 20;
        resources[ResourceType.Shardeum] += 1;
    }

    function sendResources(address to, ResourceType resource, uint256 quantity) public payable {
        resources[resource] -= quantity;

        bytes memory temp;
        bool ok;
        (temp, ok) = Nil.awaitCall(
            to,
                abi.encodeWithSignature(
                "acceptResources(address,uint256,uint8)", 
                address(this), quantity, uint8(resource))
        );

        require(ok == true, "Result not true");

        uint256 reputation = abi.decode(temp, (uint256));
        relationships[to] += reputation;
    }

    function acceptResources(address from, uint256 quantity, ResourceType resource) public payable returns (uint256) {
        resources[resource] += quantity;
        relationships[from] += 2;
        return 1;
    }

    function sendResourcesResponse(address from) public {
        relationships[from] += 1;
    }

    function whipeMe() public {
        // TODO: add normal iteration through resources
        resources[ResourceType.Iron] = 0;
        resources[ResourceType.Wood] = 0;
        resources[ResourceType.Shardeum] = 0;
        return;
    }

    receive() external payable {}

    function verifyExternal(
        uint256,
        bytes calldata
    ) external pure returns (bool) {
        return true;
    }
}