import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

import { verifyKeypair } from './utils';

const main = async () => {
  const publicKey = new PublicKey('H5BANcerHrJCwTim8ywJ3Nhpfo9PWvGtCwE45bXsgD72');

  const secretKeyInBs58 =
    '2PgHYy9mwjgztyisqvixzcNcSjRH1FZaGVYzGs3jJeQfLuQ6EZKoMHHNpHv36Fg4N3Uc7LP6ytijDfRW9eQXk8nY';
  const secretKey = bs58.decode(secretKeyInBs58);
  const keypair: Keypair = Keypair.fromSecretKey(secretKey);

  verifyKeypair(keypair, publicKey);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
