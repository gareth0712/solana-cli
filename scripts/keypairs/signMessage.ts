import { Keypair } from '@solana/web3.js';

import { logger, signMessage, verifySignature } from '@/utils';

const main = async () => {
  const message = 'Hello Solana';
  // new_account.json
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      69, 146, 180, 188, 120, 51, 55, 155, 43, 135, 240, 184, 208, 225, 137, 71, 78, 216, 181, 183,
      43, 118, 142, 103, 231, 123, 133, 193, 66, 132, 227, 95, 238, 204, 205, 198, 178, 0, 59, 75,
      91, 29, 72, 31, 175, 153, 200, 148, 152, 1, 139, 184, 4, 118, 63, 69, 248, 106, 109, 4, 91, 6,
      68, 133,
    ]),
  );

  // Sign the message with new_account's secret key
  const signature = signMessage(message, keypair);
  logger.log('Signature: ', signature);
  // Verify whether the signature is signed by new_account
  verifySignature(message, signature, keypair.publicKey);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
