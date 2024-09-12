import { Keypair, PublicKey } from '@solana/web3.js';
import path from 'path';

import { loadKeypairFromFile, verifyKeypair } from './utils';

const main = async () => {
  const publicKey = new PublicKey('H5BANcerHrJCwTim8ywJ3Nhpfo9PWvGtCwE45bXsgD72');
  const keypair: Keypair = await loadKeypairFromFile(
    path.resolve(__dirname, '../accounts/new_account.json'),
  );
  verifyKeypair(keypair, publicKey);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
