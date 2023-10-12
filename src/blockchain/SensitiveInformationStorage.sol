// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

/**
 * @title SensitiveInformationStorage
 * @dev A contract for securely storing encrypted information for users.
 */
contract SensitiveInformationStorage {
    /**
     * @dev Public state variable mapping to store encrypted information for each user.
     */
    mapping(address => mapping(uint256 => string)) public encryptedInformation;

    /**
     * @dev Public state variable mapping to keep track of the index for each user.
     */
    mapping(address => uint256) public indexByAddress;

    /**
     * @dev Event emitted when new information is stored.
     * @param user The address of the user who stored the information.
     * @param index The index of the stored information.
     */
    event NewInformationStored(address indexed user, uint256 index);

    /**
     * @dev Stores encrypted information provided by the caller.
     * @param information The encrypted information to store.
     */
    function storeInformation(string calldata information) external {
        uint256 index = indexByAddress[msg.sender];
        // Store the encrypted information for the user.
        encryptedInformation[msg.sender][index] = information;
        // Emit an event to log the storage of new information.
        emit NewInformationStored(msg.sender, index);
        // Increment the index for the user.
        indexByAddress[msg.sender] = index + 1;
    }
}
