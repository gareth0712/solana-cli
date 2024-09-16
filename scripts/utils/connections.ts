import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

import type { Commitment, PublicKey } from '@solana/web3.js';

import { NETWORKS, logger } from '.';

/**
 * Connect to Solana network given rpc url.
 */
export const connectSolRpc = (
  rpcUrl: string = NETWORKS.LOCALHOST,
  commitmentLv: Commitment = 'confirmed',
): Connection => {
  logger.section(`=========== Network Connection ===========`);
  logger.log(`Connecting to sol rpc: ${rpcUrl} at commitment level: ${commitmentLv} ...`);
  const connection = new Connection(rpcUrl, commitmentLv);

  logger.success(`Successfully obtained connection to ${rpcUrl} network.`);
  return connection;
};

/**
 * Request airdrop in solana devnet and testnet (Beware of cooldown after request)
 *
 * @param connection - Connection to the network
 * @param publicKey - Public key of the account to request airdrop
 * @param solAmount - Maximum amount of SOL to request is 3 SOL
 */
export const getAirdropSol = async (
  connection: Connection,
  publicKey: PublicKey,
  solAmount: number = 3,
) => {
  const airdropSignature = await connection.requestAirdrop(publicKey, solAmount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature);
};

/**
 * Get the balance of the account
 *
 * @param connection - Connection to the network
 * @param publicKey - Public key of the account to check balance
 */
export const getBalance = async (connection: Connection, publicKey: PublicKey) => {
  const balance = await connection.getBalance(publicKey);
  logger.log(`Balance of ${publicKey.toBase58()} is: ${balance}`);
};

/**
 * Get the minimum lamports required for rent exemption
 *
 * @param connection - Connection to the network
 * @param dataLength - Length of the data (in bytes) to check rent exemption
 */
export const getMinimumBalanceForRentExemption = async (
  connection: Connection,
  dataLength: number,
) => {
  const lamports = await connection.getMinimumBalanceForRentExemption(dataLength);
  logger.log(
    `Minimum lamports required for rent exemption: ${lamports}, i.e. ${lamports / LAMPORTS_PER_SOL} SOL`,
  );
};
