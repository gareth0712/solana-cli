import { Keypair, Connection } from '@solana/web3.js';
import fs from 'mz/fs';

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
 * Given filePath, load the keypair for further handling
 *
 * @param filePath - path to the keypair JSON file in Uint8Array format
 * @returns Keypair and its PublicKey
 */
export const loadKeypairFromFile = async (
  filePath: string,
): Promise<{ keypair: Keypair; publicKey: PublicKey }> => {
  logger.log(`Reading file path: ${filePath}`);
  const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
  const secretKey: Uint8Array = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair: Keypair = Keypair.fromSecretKey(secretKey);
  const publicKey: PublicKey = keypair.publicKey;
  logger.success(`Secret key loaded successfully. Its public key is: ${publicKey.toBase58()}`);
  return { keypair, publicKey };
};
