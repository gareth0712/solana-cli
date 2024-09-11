import { Keypair, Connection } from '@solana/web3.js';
import fs from 'mz/fs';

import { NETWORKS, logger } from '.';

/*
  Connect to Solana network given rpc url.
*/
export const connectSolRpc = async (rpcUrl?: string): Promise<Connection> => {
  logger.section(`=========== Network Connection ===========`);
  if (rpcUrl === undefined) rpcUrl = NETWORKS.LOCALHOST;
  logger.log(`Connecting to sol rpc: ${rpcUrl}...`);
  const connection = new Connection(rpcUrl, 'confirmed');

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
