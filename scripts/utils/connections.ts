import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

import type { Commitment, PublicKey } from '@solana/web3.js';

import { NETWORKS, logger } from '.';

/**
 * Connect to Solana network given rpc url.
 */
export const connectSolRpc = (
  rpcUrl: string = NETWORKS.LOCALHOST,
  commitmentLv: Commitment = 'confirmed',
): Connection => {
  logger.section(`================== Network Connection ==================`);
  logger.log(`Connecting to sol rpc: ${rpcUrl} at commitment level: ${commitmentLv} ...`);
  const connection = new Connection(rpcUrl, commitmentLv);

  logger.success(`Successfully obtained connection to ${rpcUrl} network.`);
  return connection;
};
