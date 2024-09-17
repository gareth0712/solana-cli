import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import path from 'path';

import {
  PROGRAM_PATH,
  loadKeypairFromFile,
  connectSolRpc,
  getDefaultAccount,
  getDataAccount,
  configureDataAccount,
  logger,
  addTransferSolInstruction,
  addPingInstruction,
  addCalculatorInstruction,
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

  const transaction = addTransferSolInstruction(new Transaction(), from, to, lamports);

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

  const transaction = addPingInstruction({
    transaction: new Transaction(),
    programId,
    dataAccountPubkey: clientPublicKey,
  });

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

  let transaction = addCalculatorInstruction({
    transaction: new Transaction(),
    args,
    programId,
    dataAccountPubkey: clientPublicKey,
  });

  await sendTransaction(connection, transaction, [localAccountKeypair]);
};