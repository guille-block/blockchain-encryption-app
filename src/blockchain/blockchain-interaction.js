import { ethers } from "ethers";

const iface = new ethers.Interface([
  "function storeInformation(string data) external",
  "function encryptedInformation(address user, uint256 index) external returns(string)"
]);

export const storeEncryptedData = async (signer, contract, encryptedData) => {
  try {
    const encodedData = iface.encodeFunctionData("storeInformation", [encryptedData]);
    const transaction = await signer.sendTransaction({
      to: contract, // Replace with the contract address
      data: encodedData,
    });

    await transaction.wait();
    console.log("Transaction hash:", transaction.hash);
  } catch (error) {
    console.error("Error storing encrypted data:", error);
  }
};

export const retrieveEncryptedData = async (user, index, provider, contract) => {
  try {
    const encodedData = iface.encodeFunctionData("encryptedInformation", [user, index]);
    const result = await provider.call({to: contract, data: encodedData});
    return iface.decodeFunctionResult("encryptedInformation", result)
  } catch (error) {
    console.error("Error retrieving encrypted data:", error);
  }
};
