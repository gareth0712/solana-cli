import { PublicKey, Keypair } from '@solana/web3.js';
import { getProgram, getDefaultAccount, logger } from '@/utils';

const main = async () => {
  const programName = 'p4_calculator';
  const { programId } = await getProgram(programName);
  const payer: Keypair = await getDefaultAccount();

  // A string seed or other seeds depends on program logic
  const seed = 'vault-seed';
  const [pda, bumpSeed] = PublicKey.findProgramAddressSync(
    // Seed inputs that depends on program logic
    [Buffer.from(seed), payer.publicKey.toBuffer()],
    programId, // The public key of the program
  );

  console.log('PDA:', pda.toBase58()); // The derived PDA public key
  console.log('Bump Seed:', bumpSeed); // The bump seed needed to create the same PDA; not needed upon fetching data as the PDA is already created
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
