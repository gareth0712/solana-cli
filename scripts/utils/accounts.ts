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
import yaml from 'yaml';
import 'dotenv/config';

import { CONFIG_FILE_PATH, loadKeypairFromFile, logger } from '.';

/*
  Generate an account (keypair) to transact with our program
*/
export const generateKeypair = async (): Promise<Keypair> => {
  logger.section(`========== Generating Local Account =========`);
  const generatedKeypair = Keypair.generate();
  return generatedKeypair;
};

/*
  Request airdrop solana (Beware of cooldown after request)
*/
export const getAirdropSol = async (
  connection: Connection,
  publicKey: PublicKey,
  solAmount: number,
) => {
  const airdropRequest = await connection.requestAirdrop(publicKey, solAmount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropRequest);
};

/*
  Either load Keypair or generate a local account (ensure there is +ve SOL balance)
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

/*
  Configure client account for program to store the state and modify its data. Create if it doesn't exist
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
