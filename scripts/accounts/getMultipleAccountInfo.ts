import { PublicKey } from '@solana/web3.js';

import path from 'path';

import {
  getDefaultAccount,
  loadKeypairFromFile,
  connectSolRpc,
  logger,
  ACCOUNTS_PATH,
  NETWORKS,
} from '@/utils';

const main = async () => {
  // connection to the Solana Devnet
  const rpcUrl = NETWORKS.DEVNET;
  const connection = connectSolRpc(rpcUrl);

  const firstAccount: PublicKey = (await getDefaultAccount()).publicKey;
  let filePath = path.resolve(ACCOUNTS_PATH, 'apple.json');
  const { publicKey: secondAccount } = await loadKeypairFromFile(filePath);
  filePath = path.resolve(ACCOUNTS_PATH, 'new_account.json');
  const { publicKey: thirdAccount } = await loadKeypairFromFile(filePath);

  // Define the public keys of the accounts we want to fetch
  const accountPublicKeys = [firstAccount, secondAccount, thirdAccount];

  // Use getMultipleAccountsInfo to fetch data for multiple accounts
  const accountInfos = await connection.getMultipleAccountsInfo(accountPublicKeys);

  // Check and log the fetched account information
  accountInfos.forEach((accountInfo, index) => {
    if (accountInfo) {
      logger.log(`Account ${index + 1} info:`);
      logger.log('Owner:', accountInfo.owner.toBase58()); // Account owner
      logger.log('Lamports:', accountInfo.lamports); // Balance of lamports (SOL)
      logger.log('Data:', accountInfo.data.toString()); // Account data (could be serialized)
      logger.log('Executable:', accountInfo.executable); // Whether the account is executable
    } else {
      // Account not found or unavailable if it's newly created without any SOL balance
      logger.log(`Account ${index + 1} not found or unavailable.`);
    }
  });
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
