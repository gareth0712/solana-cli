import { Keypair } from '@solana/web3.js';

import { generateKeypair, saveKeypair, logger, ACCOUNTS_DEFAULT_FILENAME } from '@/utils';

const main = async () => {
  const keypair: Keypair = generateKeypair();
  logger.log('Keypair: ', keypair);

  const publicKey = keypair.publicKey.toBase58();
  logger.log('Its Public Key is: ', publicKey);

  await saveKeypair(keypair, ACCOUNTS_DEFAULT_FILENAME);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
