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

/**
 * Load default Keypair (ensure there is +ve SOL balance)
 */
export const getDefaultAccount = async (): Promise<Keypair> => {
  logger.section(`=========== Getting Default Account as Signer ==========`);
  let keypair: Keypair;
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    logger.fail(`Config file not found at ${CONFIG_FILE_PATH}. Have you installed the Solana CLI?`);
    throw new Error('Config file not found');
  }

  try {
    const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
    const keypairPath = await yaml.parse(configYml).keypair_path;
    if (keypairPath === '' || keypairPath === null || keypairPath === undefined) {
      logger.fail(
        `Default account not found in ${CONFIG_FILE_PATH}. Please create one and ensure it has a positive SOL balance.`,
      );
      logger.fail('You can create a default account using `solana-keygen new`');
      throw new Error('Default account not found');
    }

    logger.log('keypair file (id.json) found. Reading default account...');
    ({ keypair } = await loadKeypairFromFile(keypairPath));
    logger.log(`Default account loaded successfully.`);

    logger.success(`Default Account public key is: ${keypair.publicKey.toBase58()}`);
    return keypair;
  } catch (e) {
    logger.fail(`Error getting default keypair file from config file`);
    throw e;
  }
};

export const derivePublicKeyWithSeed = async (
  basePublicKey: PublicKey,
  seed: string,
  programId: PublicKey,
): Promise<PublicKey> => {
  return await PublicKey.createWithSeed(
    basePublicKey,
    seed,
    programId, // adding the programId here makes the program owns the client account
  );
};

/**
 * Configure client account for program to store the state and modify its data. Create if it doesn't exist
 */
export const configureDataAccount = async ({
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
  logger.section(`================== Getting Data Account ================`);
  const SEED = process.env.SEED ?? 'test1';
  const dataPubKey: PublicKey = await derivePublicKeyWithSeed(localAccountKeypair.publicKey, SEED, programId);
  logger.log(`For simplicity's sake, we've derive an address using a seed: ${SEED}`);

  // Make sure it doesn't exist already.
  let dataAccount = await connection.getAccountInfo(dataPubKey);
  if (dataAccount === null) {
    logger.log(`Looks like that account does not exist. Let's create it.`);

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: localAccountKeypair.publicKey,
        basePubkey: localAccountKeypair.publicKey,
        seed: SEED,
        newAccountPubkey: dataPubKey,
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
  logger.success(`The client public key is: ${dataPubKey.toBase58()}`);
  return dataPubKey;
};

export const getDataAccount = async (
  connection: Connection,
  localAccountKeypair: Keypair,
  programId: PublicKey,
  accountSpaceSize?: number,
): Promise<PublicKey> => {
  let clientPublicKey = localAccountKeypair.publicKey;
  if (accountSpaceSize !== undefined) {
    clientPublicKey = await configureDataAccount({
      connection,
      localAccountKeypair,
      programId,
      accountSpaceSize,
    });
  }

  return clientPublicKey;
};
