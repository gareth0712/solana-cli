import { logger, NETWORKS, connectSolRpc } from '@/utils';

const main = async () => {
  const rpcUrl = NETWORKS.DEVNET;
  connectSolRpc(rpcUrl);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
