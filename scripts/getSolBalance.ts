import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { logger, NETWORKS } from '@/utils';

const main = async () => {
  // TODO: Refractor to utils
  // Mainnet wallet public key (A Custodial Wallet)
  const walletPublicKey = new PublicKey('HG7mPoRuSERG8cMjWVYQp8v4nkRuXiR7Y4556bTxkxJT');
  // Fetch the SOL balance
  const network = NETWORKS.MAINNET;
  const connection: Connection = new Connection(network);
  const tokenBalance = await connection.getBalance(walletPublicKey);
  // To verify, https://explorer.solana.com/address/HG7mPoRuSERG8cMjWVYQp8v4nkRuXiR7Y4556bTxkxJT
  console.log('SOL Balance:', tokenBalance / LAMPORTS_PER_SOL);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
