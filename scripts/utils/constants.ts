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
  MAINNET: 'https://api.mainnet-beta.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  LOCALHOST: 'http://localhost:8899',
};
