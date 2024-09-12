import { PublicKey } from '@solana/web3.js';

import { logger, validatePDA } from '@/utils';

const main = async () => {
  const newAccount = new PublicKey('H5BANcerHrJCwTim8ywJ3Nhpfo9PWvGtCwE45bXsgD72');
  const pda = new PublicKey('5ZrrH46dGVRw25P2oHBaMKFCR2D1LjVTwPuc3BFFoqLj');

  validatePDA(newAccount);
  validatePDA(pda);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
