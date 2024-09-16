import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import * as borsh from 'borsh';
import {
  NETWORKS,
  connectSolRpc,
  getProgram,
  derivePublicKeyWithSeed,
  getDefaultAccount,
  logger,
} from '@/utils';
import { Calculator, CalculatorSchema } from '@/utils/schema'; // Import the class and schema

const main = async () => {
  const programName = 'p4_calculator';

  const connection: Connection = connectSolRpc(NETWORKS.DEVNET);
  const { programId } = await getProgram(programName);
  const baseAccount: Keypair = await getDefaultAccount();
  const SEED = 'test1';

  // The public key of the data account you want to retrieve
  const dataPublicKey: PublicKey = await derivePublicKeyWithSeed(
    baseAccount.publicKey,
    SEED,
    programId,
  );

  // Fetch the account information
  const accountInfo = await connection.getAccountInfo(dataPublicKey);

  if (accountInfo === null) {
    throw new Error('Account does not exist');
  }

  // Deserialize the data
  const calculator = borsh.deserialize(CalculatorSchema, Calculator, accountInfo.data);

  console.log('Retrieved calculator account:', calculator);
  console.log('Retrieved value:', calculator.value);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
