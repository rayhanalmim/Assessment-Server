import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// Set up provider (Avalanche Fuji Testnet)
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

// Set up the wallet using the private key from .env
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export async function deployContract() {
  try {
    // Contract ABI and Bytecode (Make sure to replace this with actual ABI and bytecode)
    const lotteryAbi = [
      "function buyTicket() public payable",
      "function getPlayers() public view returns (address[] memory)",
      "event LotteryDrawn(address[] winners, uint256 round)",
      "event TicketPurchased(address indexed player, uint256 ticketNumber)"
    ];

    const lotteryBytecode = "YOUR_CONTRACT_BYTECODE"; // Replace this with the actual bytecode

    console.log("Deploying contract...");

    // Create the contract factory
    const factory = new ethers.ContractFactory(lotteryAbi, lotteryBytecode, wallet);

    // Deploy the contract
    const contractInstance = await factory.deploy();

    // Wait until the contract is deployed and mined (using the `deployed()` method)
    await contractInstance.waitForDeployment();

    console.log("Contract deployed to:", contractInstance.target);
    console.log("Contract:", contractInstance);

    // Optionally, interact with the contract after deployment (e.g., call a function)
    // For example, assuming you want to call a function `setName` on the contract:
    // const setNameResponse = await contractInstance.setName("GeeksforGeeks");
    // await setNameResponse.wait();  // Wait for the transaction to complete

    return contractInstance.target;  // Return the deployed contract's address
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}
