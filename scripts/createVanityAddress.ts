import { Keypair } from '@solana/web3.js';
import path from 'path';

import { logger, generateVanityAddress, saveKeypair, ACCOUNTS_PATH } from './utils';

const main = async () => {
  const requiredPrefix = '69';
  const requiredSuffix = '';

  const keypair: Keypair = generateVanityAddress(requiredPrefix, requiredSuffix);

  logger.success('Vanity address created!');
  logger.log('public key: ', keypair.publicKey.toBase58());
  logger.log('secret key: ', keypair.secretKey);
  await saveKeypair(keypair, path.resolve(ACCOUNTS_PATH, 'vanity_account.json'));
  // public key of current vanity_account.json
  // 69dG12zt4y4uaRW1oBAupaPu2efX7SptzPemK35iEeyi
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
