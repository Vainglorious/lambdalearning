// index.mjs

import { ethers } from 'ethers';

export default async function handler(event) {
    // Load environment variables
    const PRIVATE_KEY = '6d6327cd3353764030e21337e149e79e912259c834bda39b19bfd0a0430313b5';
    const TOKEN_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000022';
    const RECIPIENT_ADDRESS = '0x57Af324179557BB1061D4B5B68b027bf95C5BeA8';
    const BLAST_RPC_URL = 'https://blastl2-sepolia.blastapi.io/ccf587a5-8be6-46fb-944a-84f9a0e55734';

    // Specify the network with chain ID
    const network = {
        name: 'blast-l2-sepolia',
        chainId: 168587773 // Replace with the actual chain ID if necessary
    };

    // Connect to the Ethereum network using Blast's RPC URL and specified network
    const provider = new ethers.JsonRpcProvider(BLAST_RPC_URL, network);

    // Create a wallet instance
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // ERC-20 Token ABI (minimal)
    const tokenAbi = [
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];

    // Create a contract instance
    const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, wallet);

    try {
        // Define the amount to send (1 token, adjusted for decimals)
        const decimals = 18; // Adjust if necessary
        const amount = ethers.parseUnits('1', decimals);

        // Send the token
        const tx = await tokenContract.transfer(RECIPIENT_ADDRESS, amount);
        console.log('Transaction hash:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction was mined in block:', receipt.blockNumber);

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify('Token sent successfully'),
        };
    } catch (error) {
        console.error('Error sending token:', error);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify('Error sending token'),
        };
    }
}
