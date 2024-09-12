import { PublicKey, Keypair, Connection } from '@solana/web3.js';
import { connectSolRpc, transferSol, NETWORKS, getDefaultAccount, logger } from '@/utils';

const main = async () => {
  const rpcUrl = NETWORKS.DEVNET;
  // Amount of SOL to send
  const amount = 0.1;
  // Load the sender's keypair from default wallet created using solana cli as follows
  // $ solana-keygen new
  // Ensure there is sufficient SOL to send
  const from: Keypair = await getDefaultAccount();
  // Recipient public key
  const to: PublicKey = new PublicKey('Ghmhmgesvh1pDpp6mUT3PzGLzvLqVRJS1MuQpW41xTEY');

  const connection: Connection = connectSolRpc(rpcUrl);
  await transferSol(connection, from, to, amount);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
