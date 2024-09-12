import { clusterApiUrl } from '@solana/web3.js';
import path from 'path';
import os from 'os';

export const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');

export const ACCOUNTS_PATH = path.resolve(__dirname, '../../accounts');

export const ACCOUNTS_DEFAULT_FILENAME = path.resolve(ACCOUNTS_PATH, 'new_account.json');
/**
 * Path to Solana CLI config file.
 */
export const CONFIG_FILE_PATH = path.resolve(
  os.homedir(),
  '.config',
  'solana',
  'cli',
  'config.yml',
);

export const NETWORKS = {
  MAINNET: clusterApiUrl('mainnet-beta'),
  TESTNET: clusterApiUrl('testnet'),
  DEVNET: clusterApiUrl('devnet'),
  LOCALHOST: 'http://localhost:8899',
};
