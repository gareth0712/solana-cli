import { logger, restoreKeypairFromMnemonic } from './utils';

const main = async () => {
  // Phrase from solana cookbook
  const mnemonic =
  "neither lonely flavor argue grass remind eye tag avocado spot unusual intact";
  const { keypairs, base58SecretKeys } = restoreKeypairFromMnemonic(mnemonic);
  
  logger.log('Length of keypairs', keypairs.length);
  logger.log('Length of base58SecretKeys', base58SecretKeys.length);
  logger.log('All base58 secretKeys restored', base58SecretKeys);

  // e.g. wallet #0 5vftMkHL72JaJG6ExQfGAsT2uGVHpRR7oTNUPMs68Y2N
  // private key 3zK9yXHAHova8bjeAGsNZEQJgqQs9EW9QE1pDQDPVjeHWJhpoghqNQHYvgvhJ1mQrBRJfmcx4ftu3dKjnVVym6FL
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
