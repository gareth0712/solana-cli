import { logger, NETWORKS, connectSolRpc, getAirdropSol, getDefaultAccount } from '@/utils';

const main = async () => {
  const rpcUrl = NETWORKS.DEVNET;
  const solAmount = 3;
  const publicKey = (await getDefaultAccount()).publicKey;

  const connection = connectSolRpc(rpcUrl);
  await getAirdropSol(connection, publicKey, solAmount);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
