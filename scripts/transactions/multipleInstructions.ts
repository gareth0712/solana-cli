import { Keypair } from '@solana/web3.js';
import path from 'path';

import {
  NETWORKS,
  CALCULATOR_SIZE,
  ACCOUNTS_PATH,
  loadKeypairFromFile,
  multipleInstructions,
  logger,
  CalculatorArgs,
  getDefaultAccount,
} from '@/utils';

/**
 * This script demonstrates a transaction with multiple instructions:
 * 1. Transfer SOL from Account A to B
 * 2. Transfer SOL from Account B to C
 * 3. Execute a custom program call in the same transaction. (Either Signer A and B can sign for it)
 */
async function main() {
  const programName = 'p4_calculator';
  const secondAccount = 'apple.json';
  const thirdAccount = 'bob.json';

  const args: CalculatorArgs = {
    operation: 1,
    operating_value: 8,
  };

  const firstKeypair: Keypair = await getDefaultAccount();
  let filePath = path.resolve(ACCOUNTS_PATH, secondAccount);
  const { keypair: secondKeypair } = await loadKeypairFromFile(filePath);
  filePath = path.resolve(ACCOUNTS_PATH, thirdAccount);
  const { keypair: thirdKeypair } = await loadKeypairFromFile(filePath);

  await multipleInstructions(programName, args, {
    accountSpaceSize: CALCULATOR_SIZE,
    rpcUrl: NETWORKS.DEVNET,
    keypairs: [firstKeypair, secondKeypair, thirdKeypair],
  });
}

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
