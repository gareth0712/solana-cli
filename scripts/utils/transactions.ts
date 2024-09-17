import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import path from 'path';

import {
  PROGRAM_PATH,
  loadKeypairFromFile,
  connectSolRpc,
  getDefaultAccount,
  getDataAccount,
  logger,
  getTransferSolInstruction,
  getPingInstruction,
  getCalculatorInstruction,
  CalculatorArgs,
} from '.';

// ======================= General Function =======================
/**
 * Get the following for targeted program (ensure you have already deployed the program):
 * a) program keypair: Keypair we used to create the on-chain Rust program;
 * b) programId
 */
export const getProgram = async (
  programName: string,
): Promise<{ programKeypair: Keypair; programId: PublicKey }> => {
  logger.section(`==================== Getting Program ===================`);
  // e.g. hello_solana => hello_solana-keypair.json
  const { keypair: programKeypair } = await loadKeypairFromFile(
    path.join(PROGRAM_PATH, programName + '-keypair.json'),
  );
  const programId: PublicKey = programKeypair.publicKey;

  logger.log(`We're going to ping the ${programName} program.`);
  logger.success(`Its Program ID is: ${programId.toBase58()}`);
  return { programKeypair, programId };
};

type Instruction = (...args: any[]) => TransactionInstruction;

export const constructTransaction = (
  instructionCreators: { instruction: Instruction; params: {} }[],
): Transaction => {
  let transaction = new Transaction();
  instructionCreators.forEach(({ instruction, params }) => {
    transaction.add(instruction({ ...params }));
  });
  return transaction;
};

export const sendTransaction = async (
  connection: Connection,
  transaction: Transaction,
  signers: Keypair[],
) => {
  logger.section(`================== Sending Transaction =================`);
  try {
    // Send and wait until the transaction is confirmed
    const signature = await sendAndConfirmTransaction(connection, transaction, signers);
    logger.success('Transaction signature:', signature);
  } catch (error) {
    logger.fail('Transaction failed:', error);
  }
};

// ======================== System Program ========================
/**
 * Here we are sending lamports using the Rust program we wrote.
 */
export const transferSol = async (
  connection: Connection,
  from: Keypair,
  to: PublicKey,
  amount: number,
) => {
  // 1 SOL = 1,000,000,000 (i.e. 1 * 10^9) lamports
  const lamports = LAMPORTS_PER_SOL * amount;
  logger.log(`Transferring ${amount} SOL from ${from.publicKey.toBase58()}`);
  logger.log(`to ${to.toBase58()}`);

  const transaction = constructTransaction([
    { instruction: getTransferSolInstruction, params: { from, to, lamports } },
  ]);

  await sendTransaction(connection, transaction, [from]);
};

// ======================== Other Programs ========================
export const pingProgram = async (
  programName: string,
  options?: {
    accountSpaceSize?: number;
    rpcUrl?: string;
  },
) => {
  logger.section(`============= Launching PingProgram Client =============`);
  const connection: Connection = connectSolRpc(options?.rpcUrl);
  const { programId } = await getProgram(programName);
  logger.log(`🚧 Pinging ${programName} program of programId ${programId.toBase58()}...`);

  const localAccountKeypair: Keypair = await getDefaultAccount();
  const clientPublicKey: PublicKey = await getDataAccount(
    connection,
    localAccountKeypair,
    programId,
    options?.accountSpaceSize,
  );
  const transaction = constructTransaction([
    { instruction: getPingInstruction, params: { programId, dataAccountPubkey: clientPublicKey } },
  ]);

  await sendTransaction(connection, transaction, [localAccountKeypair]);
};

export const operateCalculator = async (
  programName: string,
  args: CalculatorArgs,
  options?: {
    accountSpaceSize?: number;
    rpcUrl?: string;
  },
) => {
  logger.section(`========= Launching Operate Calculator Client ==========`);
  const connection: Connection = connectSolRpc(options?.rpcUrl);
  const { programId } = await getProgram(programName);
  logger.log(
    `🚧 Sending instruction to ${programName} program of programId ${programId.toBase58()}`,
  );

  const localAccountKeypair: Keypair = await getDefaultAccount();
  const clientPublicKey: PublicKey = await getDataAccount(
    connection,
    localAccountKeypair,
    programId,
    options?.accountSpaceSize,
  );

  const transaction = constructTransaction([
    {
      instruction: getCalculatorInstruction,
      params: {
        args,
        programId,
        dataAccountPubkey: clientPublicKey,
      },
    },
  ]);

  await sendTransaction(connection, transaction, [localAccountKeypair]);
};

export const multipleInstructions = async (
  programName: string,
  args: CalculatorArgs,
  options?: {
    accountSpaceSize?: number;
    rpcUrl?: string;
    keypairs?: Keypair[];
  },
) => {
  logger.section(`======= Launching Multiple Instructions Client =========`);
  const connection: Connection = connectSolRpc(options?.rpcUrl);
  const { programId } = await getProgram(programName);
  logger.log(
    `🚧 Going to send instruction to ${programName} program of programId ${programId.toBase58()}`,
  );

  if (!options?.keypairs || options?.keypairs.length != 3) {
    throw new Error('Please provide 3 public keys for multiple instructions');
  }

  const [firstKeypair, secondKeypair, thirdKeypair] = options.keypairs;
  const clientPublicKey: PublicKey = await getDataAccount(
    connection,
    firstKeypair,
    programId,
    options?.accountSpaceSize,
  );

  const transaction = constructTransaction([
    {
      instruction: getTransferSolInstruction,
      params: {
        from: firstKeypair,
        to: secondKeypair.publicKey,
        lamports: 1 * LAMPORTS_PER_SOL,
      },
    },
    {
      instruction: getTransferSolInstruction,
      params: {
        from: secondKeypair,
        to: thirdKeypair.publicKey,
        lamports: 0.5 * LAMPORTS_PER_SOL,
      },
    },
    {
      instruction: getCalculatorInstruction,
      params: {
        args,
        programId,
        dataAccountPubkey: clientPublicKey,
      },
    },
  ]);

  // A: firstKeypair, B: secondKeypair, and C: thirdKeypair
  // 1st instruction (A transfer 1 sol to B) signed by A
  // 2nd instruction (B transfer 0.5 sol to C) signed by B
  // 3rd instruction (calculator instruction) signed by either A or B
  await sendTransaction(connection, transaction, [firstKeypair, secondKeypair]);
};
