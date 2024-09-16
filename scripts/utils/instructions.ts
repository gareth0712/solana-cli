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
export const addTransferSolInstruction = (
  transaction: Transaction,
  from: Keypair,
  to: PublicKey,
  lamports: number,
) => {
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports,
    }),
  );

  return transaction;
};

// ================= Program Specific Instructions ================
/**
 * Add instruction to ping the program that accepts empty data buffer
 */
export const addPingInstruction = ({
  transaction,
  programId,
  dataAccountPubkey, // supply local account if no state is needed in the program
}: {
  transaction: Transaction;
  programId: PublicKey;
  dataAccountPubkey: PublicKey;
}) => {
  logger.section(`============= Adding Ping Program instruction ==========`);

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: dataAccountPubkey, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0), // Empty instruction data
  });

  transaction.add(instruction);
  return transaction;
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
 * Add calculator instruction with given operation and operating value
 */
export const addCalculatorInstruction = ({
  transaction,
  args,
  programId,
  dataAccountPubkey,
}: {
  transaction: Transaction; // Transaction to add instruction to
  args: CalculatorArgs;
  programId: PublicKey;
  dataAccountPubkey: PublicKey;
}): Transaction => {
  logger.section(`============= Adding Calculator Instruction ============`);

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

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: dataAccountPubkey, isSigner: false, isWritable: true }],
    programId,
    data: calcInstructions,
  });

  transaction.add(instruction);
  return transaction;
};

// const createInstruction = async (
//   transaction: Transaction,
//   programId: PublicKey,
//   amount: string,
//   from: Keypair,
//   to: PublicKey,
// ) => {
//   let data = Buffer.alloc(8); // 8 bytes
//   // lo.ns64("value").encode(new BN(amount), data);
//   lo.ns64('value').encode(amount, data);

//   let ins = new TransactionInstruction({
//     keys: [
//       { pubkey: from.publicKey, isSigner: true, isWritable: true }, // debit sol balance
//       { pubkey: to, isSigner: false, isWritable: true }, // credit sol balance
//       { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // invoke system program for transfer of sol
//     ],
//     programId: programId,
//     data: data,
//   });

//   await sendAndConfirmTransaction(connection, new Transaction().add(ins), [from]);
// };
