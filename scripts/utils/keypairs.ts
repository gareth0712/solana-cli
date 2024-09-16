import {
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import { writeFile } from 'fs/promises';
import bs58 from 'bs58';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import 'dotenv/config';

import { ACCOUNTS_DEFAULT_FILENAME, logger } from '.';

/**
 * Generate a new account (keypair) to transact with our program
 */
export const generateKeypair = (): Keypair => {
  logger.section(`========== Generating Local Account =========`);
  return Keypair.generate();
};

/**
 * Generate a new account (keypair) with specified prefix
 * @param prefix - prefix for the seed
 *
 * @returns
 */
export const generateVanityAddress = (prefix: string, suffix: string): Keypair => {
  let keypair: Keypair = Keypair.generate();
  while (
    !keypair.publicKey.toBase58().startsWith(prefix) ||
    !keypair.publicKey.toBase58().endsWith(suffix)
  ) {
    keypair = Keypair.generate();
  }

  return keypair;
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
 * Restore a secret key from Base58 to a Keypair
 */
export const restoreKeypairFromBase58 = (base58: string): Keypair => {
  return Keypair.fromSecretKey(bs58.decode(base58));
};

export const restoreKeypairFromMnemonic = (
  mnemonic: string,
): { keypairs: Keypair[]; base58SecretKeys: string[] } => {
  const keypairs: Keypair[] = [];
  const base58SecretKeys: string[] = [];
  const seed = mnemonicToSeedSync(mnemonic, ''); // (mnemonic, password)

  for (let i = 0; i < 10; i++) {
    const path = `m/44'/501'/${i}'/0'`;
    const keypair = Keypair.fromSeed(derivePath(path, seed.toString('hex')).key);
    keypairs.push(keypair);
    logger.log(`Restored Public Key #${i} using ${path} => ${keypair.publicKey.toBase58()}`);
    // verifyKeypair(keypair, keypair.publicKey);

    const base58SecretKey = getBase58FromKeypair(keypair);
    // logger.success(`Public Key #${i}'s Base58 Secret Key: ${base58SecretKey}`);
    base58SecretKeys.push(base58SecretKey);
  }
  return { keypairs, base58SecretKeys };
};
/**
 * Convert a Keypair to Base58 secret key
 */
export const getBase58FromKeypair = (keypair: Keypair): string => {
  const secretKey: Uint8Array = keypair.secretKey;
  return bs58.encode(secretKey);
};

export const signMessage = (message: string, keypair: Keypair): Uint8Array => {
  logger.log('Public Key: ', keypair.publicKey.toBase58());
  logger.log('Message to be signed:', message);
  const messageBytes = decodeUTF8(message);
  return nacl.sign.detached(messageBytes, keypair.secretKey);
};

export const verifySignature = (
  message: string,
  signature: Uint8Array,
  publicKey: PublicKey,
): boolean => {
  const messageBytes = decodeUTF8(message);
  const isValid = nacl.sign.detached.verify(messageBytes, signature, publicKey.toBytes());

  if (isValid) {
    logger.success(`Signature is valid and is signed by ${publicKey.toBase58()}`);
  } else {
    logger.fail(`Signature is not valid or is not signed by ${publicKey.toBase58()}`);
  }
  return isValid;
};

/**
 * Validate whether the provided public key is a Program Derived Address (PDA)
 * @param publicKey
 * @returns boolean - true if PDA, false otherwise
 */
export const validatePDA = (publicKey: PublicKey): boolean => {
  const isPDA = !PublicKey.isOnCurve(publicKey);
  if (isPDA) {
    logger.success(`The public key ${publicKey.toBase58()} is a Program Derived Address (PDA)`);
  } else {
    logger.fail(`The public key ${publicKey.toBase58()} is not a Program Derived Address (PDA)`);
  }
  return isPDA;
};
