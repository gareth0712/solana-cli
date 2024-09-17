import {
  SystemProgram,
  Transaction,
  PublicKey,
  Keypair,
  TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from '@solana/buffer-layout';
import { Buffer } from 'buffer';

import { logger, CalculatorArgs } from '.';

// ================== System Program Instructions =================
export const getTransferSolInstruction = ({
  from,
  to,
  lamports,
}: {
  from: Keypair;
  to: PublicKey;
  lamports: number;
}): TransactionInstruction => {
  return SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports,
  });
};

// ================= Program Specific Instructions ================
/**
 * Construct instruction to ping the program that accepts empty data buffer
 */
export const getPingInstruction = ({
  programId,
  dataAccountPubkey, // supply local account if no state is needed in the program
}: {
  transaction: Transaction;
  programId: PublicKey;
  dataAccountPubkey: PublicKey;
}): TransactionInstruction => {
  logger.section(`========== Constructing Ping Program instruction =======`);

  return new TransactionInstruction({
    keys: [{ pubkey: dataAccountPubkey, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0), // Empty instruction data
  });
};

/**
 * Helper function for calculator instruction
 */
export const getStringForInstruction = (operation: number, operating_value: number) => {
  if (operation == 0) {
    return 'reset the example.';
  } else if (operation == 1) {
    return `add: ${operating_value}`;
  } else if (operation == 2) {
    return `subtract: ${operating_value}`;
  } else if (operation == 3) {
    return `multiply by: ${operating_value}`;
  }
};

/**
 * Construct the calculator instruction with given operation and operating value
 */
export const getCalculatorInstruction = ({
  args,
  programId,
  dataAccountPubkey,
}: {
  args: CalculatorArgs;
  programId: PublicKey;
  dataAccountPubkey: PublicKey;
}): TransactionInstruction => {
  logger.section(`========== Constructing Calculator Instruction =========`);

  const { operation, operating_value } = args;
  logger.log(`🚧 Given operation ${operation} of value ${operating_value}...`);
  logger.log(`🚧 We're going to ${getStringForInstruction(operation, operating_value)}`);

  const bufferLayout: BufferLayout.Structure<CalculatorArgs> = BufferLayout.struct([
    BufferLayout.u32('operation'),
    BufferLayout.u32('operating_value'),
  ]);

  const calcInstructions = Buffer.alloc(bufferLayout.span);
  bufferLayout.encode(
    {
      operation,
      operating_value,
    },
    calcInstructions,
  );

  return new TransactionInstruction({
    keys: [{ pubkey: dataAccountPubkey, isSigner: false, isWritable: true }],
    programId,
    data: calcInstructions,
  });
};
