import { Keypair, Connection } from '@solana/web3.js';
import fs from 'mz/fs';

import type { Commitment } from '@solana/web3.js';

import { NETWORKS, logger } from '.';

/*
  Connect to Solana network given rpc url.
*/
export const connectSolRpc = async (
  rpcUrl: string = NETWORKS.LOCALHOST,
  commitmentLv: Commitment = 'confirmed',
): Promise<Connection> => {
  logger.section(`=========== Network Connection ===========`);
  logger.log(`Connecting to sol rpc: ${rpcUrl} at commitment level: ${commitmentLv} ...`);
  const connection = new Connection(rpcUrl, commitmentLv);

  logger.success(`Successfully connected to Solana network.`);
  return connection;
};

/*
  Given filePath, load the keypair for further handling
*/
export const loadKeypairFromFile = async (filePath: string): Promise<Keypair> => {
  logger.log('Reading file path: ', filePath);
  const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
};
