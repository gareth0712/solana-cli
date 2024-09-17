import { logger, NETWORKS, connectSolRpc } from '@/utils';

const main = async () => {
  const rpcUrl = NETWORKS.DEVNET;
  const connection = connectSolRpc(rpcUrl);

  // fetches the current slot number
  let slot = await connection.getSlot();
  logger.log(`current slot is ${slot}`);

  // retrieves the Unix timestamp (in seconds) when the block corresponding
  // to the provided slot (e.g., 93186439) was confirmed.
  let blockTime = await connection.getBlockTime(slot);
  logger.log(`block time of the current slot ${blockTime}`); // 1630747045

  // fetches detailed block info corresponding to the provided slot
  // (e.g., 93186439).
  let block = await connection.getBlock(slot, { maxSupportedTransactionVersion: 0 });
  logger.log('block details is');
  logger.log(block);

  // public key of the validator that is currently responsible
  // for producing the block in the current slot
  let slotLeader = await connection.getSlotLeader();
  logger.log(`slot leader is: ${slotLeader}`);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
