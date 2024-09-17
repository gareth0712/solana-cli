import { Connection } from '@solana/web3.js';

import { logger, connectSolRpc, getMinimumBalanceForRentExemption, NETWORKS } from '@/utils';

const main = async () => {
  const connection: Connection = connectSolRpc(NETWORKS.DEVNET);
  // Get the minimum lamports required for rent exemption
  const dataLength = 18;
  await getMinimumBalanceForRentExemption(connection, dataLength);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
