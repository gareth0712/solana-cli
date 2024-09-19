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
 * Request airdrop in solana devnet and testnet (Beware of cooldown after request)
 *
 * @param connection - Connection to the network
 * @param publicKey - Public key of the account to request airdrop
 * @param solAmount - Maximum amount of SOL to request is 3 SOL
 */
export const getAirdropSol = async (
  connection: Connection,
  publicKey: PublicKey,
  solAmount: number = 3,
) => {
  logger.section(`================== Requesting Airdrop ==================`);
  await getBalance(connection, publicKey);
  const airdropSignature = await connection.requestAirdrop(publicKey, solAmount * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature);

  logger.success(`Airdrop of ${solAmount} SOL successful.`);
  await getBalance(connection, publicKey);
};

/**
 * Get SOL balance of the account
 *
 * @param connection - Connection to the network
 * @param publicKey - Public key of the account to check balance
 */
export const getBalance = async (connection: Connection, publicKey: PublicKey): Promise<number> => {
  const balance = await connection.getBalance(publicKey);
  logger.log(`Balance of ${publicKey.toBase58()} is: ${balance / LAMPORTS_PER_SOL} SOL`);
  return balance;
};

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
 * Get the minimum lamports required for rent exemption
 *
 * @param connection - Connection to the network
 * @param dataLength - Length of the data (in bytes) to check rent exemption
 */
export const getMinimumBalanceForRentExemption = async (
  connection: Connection,
  dataLength: number,
): Promise<number> => {
  const lamports = await connection.getMinimumBalanceForRentExemption(dataLength);
  logger.log(
    `Minimum lamports required for rent exemption: ${lamports}, i.e. ${lamports / LAMPORTS_PER_SOL} SOL`,
  );
  return lamports;
};

/**
 * Configure data account for program to store the state and modify its data. Create if it doesn't exist;
 * Helper function of getDataAccount
 */
export const configureDataAccount = async ({
  connection,
  baseAccountKeypair,
  programId,
  accountSpaceSize,
}: {
  connection: Connection;
  baseAccountKeypair: Keypair;
  programId: PublicKey;
  accountSpaceSize: number;
}): Promise<PublicKey> => {
  logger.section(`================== Getting Data Account ================`);
  const SEED = process.env.SEED ?? 'test1';
  const dataPubKey: PublicKey = await derivePublicKeyWithSeed(
    baseAccountKeypair.publicKey,
    SEED,
    programId,
  );
  logger.log(`For simplicity's sake, we've derive an address using a seed: ${SEED}`);

  // Make sure it doesn't exist already.
  let dataAccount = await connection.getAccountInfo(dataPubKey);
  if (dataAccount === null) {
    logger.log(`Looks like that account does not exist. Let's create it.`);
    const requiredLamports = await getMinimumBalanceForRentExemption(connection, accountSpaceSize);

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: baseAccountKeypair.publicKey,
        basePubkey: baseAccountKeypair.publicKey,
        seed: SEED,
        newAccountPubkey: dataPubKey,
        lamports: requiredLamports,
        space: accountSpaceSize,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [baseAccountKeypair]);

    logger.success(`Client account created successfully.`);
  } else {
    logger.success(`Looks like that account exists already. We can just use it.`);
  }
  logger.success(`The client public key is: ${dataPubKey.toBase58()}`);
  return dataPubKey;
};

/**
 * Get data account by a combination of program Id, seed (from env) and base account Keypair;
 * If no account space required (for instructions that don't modify account data like ping hello solana)
 * return base account instead
 *
 * @param connection
 * @param baseAccountKeypair
 * @param programId
 * @param seed
 * @param accountSpaceSize
 * @returns
 */
export const getDataAccount = async (
  connection: Connection,
  baseAccountKeypair: Keypair,
  programId: PublicKey,
  accountSpaceSize?: number,
): Promise<PublicKey> => {
  let clientPublicKey = baseAccountKeypair.publicKey;
  if (accountSpaceSize !== undefined) {
    clientPublicKey = await configureDataAccount({
      connection,
      baseAccountKeypair,
      programId,
      accountSpaceSize,
    });
  }

  return clientPublicKey;
};
