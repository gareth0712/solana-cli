import { PublicKey } from '@solana/web3.js';
import { connectSolRpc, NETWORKS, logger } from '@/utils';

const main = async () => {
  // TODO: Refractor to utils
  const programId = new PublicKey('356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR');
  const connection = connectSolRpc(NETWORKS.DEVNET);
  const signatures = await connection.getSignaturesForAddress(programId, { limit: 10 });

  for (const signatureInfo of signatures) {
    const transaction = await connection.getTransaction(signatureInfo.signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0, // only 0 and legacy 2 versions
    });
    console.log('Transaction:', transaction);
  }
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
