import { logger, NETWORKS, connectSolRpc } from '@/utils';

const main = async () => {
  const rpcUrl = NETWORKS.DEVNET;
  connectSolRpc(rpcUrl);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
