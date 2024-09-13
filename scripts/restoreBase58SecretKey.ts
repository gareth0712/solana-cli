import { Keypair, PublicKey } from '@solana/web3.js';

import { restoreKeypairFromBase58, verifyKeypair, logger } from './utils';

const main = async () => {
  // new_account.json
  const publicKey = new PublicKey('H5BANcerHrJCwTim8ywJ3Nhpfo9PWvGtCwE45bXsgD72');

  const secretKeyBs58 =
    '2PgHYy9mwjgztyisqvixzcNcSjRH1FZaGVYzGs3jJeQfLuQ6EZKoMHHNpHv36Fg4N3Uc7LP6ytijDfRW9eQXk8nY';
  const keypair: Keypair = restoreKeypairFromBase58(secretKeyBs58);

  verifyKeypair(keypair, publicKey);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
