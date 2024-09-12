import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import { writeFile } from 'fs/promises';
import yaml from 'yaml';
import 'dotenv/config';

import { CONFIG_FILE_PATH, ACCOUNTS_DEFAULT_FILENAME, loadKeypairFromFile, logger } from '.';

/**
 * Generate a new account (keypair) to transact with our program
 */
export const generateKeypair = (): Keypair => {
  logger.section(`========== Generating Local Account =========`);
  return Keypair.generate();
};

/**
 * Save Keypair to a file
 *
 * @param publicKey
 * @param path - path to save the keypair
 */
export const saveKeypair = async (keypair: Keypair, path: string = ACCOUNTS_DEFAULT_FILENAME) => {
  // Extract the secret key and convert it to a regular array for JSON serialization
  const secretKey = Array.from(keypair.secretKey);
  logger.log('Its Secret Key is: ', secretKey);

  // Save the secret key array to a JSON file
  await writeFile(path, JSON.stringify(secretKey));
  logger.success(`Secret key saved to ${path}`);
};

export const verifyKeypair = (keypair: Keypair, publicKey: PublicKey): Boolean => {
  const isKeypairMatchPubKey = keypair.publicKey.toBase58() === publicKey.toBase58();
  const logMessage = `Is the Public key ${publicKey.toBase58()} matched against the provided secretKey? ${isKeypairMatchPubKey}`;

  if (isKeypairMatchPubKey) {
    logger.success(logMessage);
  } else {
    logger.fail(logMessage);
  }
  return isKeypairMatchPubKey;
};
/**
 * Request airdrop solana (Beware of cooldown after request)
 */
export const getAirdropSol = async (
  connection: Connection,
  publicKey: PublicKey,
  solAmount: number,
) => {
  const airdropRequest = await connection.requestAirdrop(publicKey, solAmount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropRequest);
};

/**
 * Either load Keypair or generate a local account (ensure there is +ve SOL balance)
 */
export const getAccount = async (): Promise<Keypair> => {
  logger.section(`========== Getting Local Account =========`);
  let keypair: Keypair;
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
    const keypairPath = await yaml.parse(configYml).keypair_path;
    logger.log('keypair file (id.json) found. Reading local account...');
    keypair = await loadKeypairFromFile(keypairPath);
    logger.log(`Local account loaded successfully.`);
  } else {
    keypair = await generateKeypair();
    logger.log(`Local account generated successfully.`);
  }
  logger.success(`Local Account public key is: ${keypair.publicKey.toBase58()}`);
  return keypair;
};

/**
 * Configure client account for program to store the state and modify its data. Create if it doesn't exist
 */
export const configureClientAccount = async ({
  connection,
  localAccountKeypair,
  programId,
  accountSpaceSize,
}: {
  connection: Connection;
  localAccountKeypair: Keypair;
  programId: PublicKey;
  accountSpaceSize: number;
}): Promise<PublicKey> => {
  logger.section(`========== Getting Client Account =========`);
  const SEED = process.env.SEED ?? 'test1';
  const clientPubKey: PublicKey = await PublicKey.createWithSeed(
    localAccountKeypair.publicKey,
    SEED,
    programId, // adding the programId here makes the program owns the client account
  );

  logger.log(`For simplicity's sake, we've created an address using a seed: ${SEED}`);

  // Make sure it doesn't exist already.
  let clientAccount = await connection.getAccountInfo(clientPubKey);
  if (clientAccount === null) {
    logger.log(`Looks like that account does not exist. Let's create it.`);

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: localAccountKeypair.publicKey,
        basePubkey: localAccountKeypair.publicKey,
        seed: SEED,
        newAccountPubkey: clientPubKey,
        lamports: LAMPORTS_PER_SOL,
        space: accountSpaceSize,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [localAccountKeypair]);

    logger.success(`Client account created successfully.`);
  } else {
    logger.success(`Looks like that account exists already. We can just use it.`);
  }
  logger.success(`The client public key is: ${clientPubKey.toBase58()}`);
  return clientPubKey;
};
