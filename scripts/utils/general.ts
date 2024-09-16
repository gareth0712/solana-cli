import { Keypair } from '@solana/web3.js';
import fs from 'mz/fs';

import type { PublicKey } from '@solana/web3.js';

import { logger } from '.';

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
