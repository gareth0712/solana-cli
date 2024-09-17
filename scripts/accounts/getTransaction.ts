import { PublicKey } from '@solana/web3.js';
import { connectSolRpc, NETWORKS, logger } from '@/utils';

const main = async () => {
  // TODO: Refractor to utils
  const programId = new PublicKey('356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR');
  const connection = connectSolRpc(NETWORKS.DEVNET);
  const signature =
    '3zfUixZWXbNCupga6ejK1MDPM5PbKp1kuPzJDLmzKMJ4MmTzrErMx5gc2HrWTes8GVVuF6rM4MDByDMprZ9yn1Jj';
  const transaction = await connection.getTransaction(signature, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0, // only 0 and legacy 2 versions
  });
  console.log('Transaction:', transaction);
  if (transaction === null) throw new Error('Transaction not found');
  // Uncomment out any of the following lines to see the output
  // const transactionInstructions = transaction.transaction.message.instructions;
  // console.log('Instructions:', transactionInstructions);
  // const transactionAccountKeys = transaction.transaction.message.accountKeys;
  // console.log('Account keys:', transactionAccountKeys);
  // const header = transaction.transaction.message.header;
  // console.log('Header:', header);
  // const indexToProgramIds = transaction.transaction.message.indexToProgramIds;
  // console.log('Index to program IDs:', indexToProgramIds);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
