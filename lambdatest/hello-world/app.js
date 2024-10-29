// Import specific classes and functions from ethers
const { Wallet, Contract, parseUnits, JsonRpcProvider } = require('ethers');

exports.lambdaHandler = async (event, context) => {
    let response;

    try {
        // // Load environment variables
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
        const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
        const BLAST_RPC_URL = process.env.BLAST_RPC_URL;


        // Specify the network with chain ID
        const network = {
            name: 'blast-l2-sepolia',
            chainId: 168587773 // Replace with the actual chain ID if necessary
        };

        // Connect to the Ethereum network using Blast's RPC URL and specified network
        const provider = new JsonRpcProvider(BLAST_RPC_URL, network);

        // Create a wallet instance
        const wallet = new Wallet(PRIVATE_KEY, provider);

        // ERC-20 Token ABI (minimal)
        const tokenAbi = [
            "function transfer(address to, uint256 amount) external returns (bool)"
        ];

        // Create a contract instance
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, wallet);

        // Define the amount to send (1 token, adjusted for decimals)
        const decimals = 18; // Adjust if necessary
        const amount = parseUnits('1', decimals);

        // Send the token
        const tx = await tokenContract.transfer(RECIPIENT_ADDRESS, amount);
        console.log('Transaction hash:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction was mined in block:', receipt.blockNumber);

        // Return success response
        response = {
            statusCode: 200,
            body: JSON.stringify('Token sent successfully'),
        };
    } catch (error) {
        console.error('Error sending token:', error);

        // Return error response
        response = {
            statusCode: 500,
            body: JSON.stringify('Error sending token'),
        };
    }

    return response;
};
