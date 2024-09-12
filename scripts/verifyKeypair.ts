import { PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { verifyKeypair } from '@/utils';

const main = async () => {
  const publicKey = new PublicKey('H5BANcerHrJCwTim8ywJ3Nhpfo9PWvGtCwE45bXsgD72');

  // Load keypair from secret key in(Uint8Array)
  const secretKey = Uint8Array.from([
    69, 146, 180, 188, 120, 51, 55, 155, 43, 135, 240, 184, 208, 225, 137, 71, 78, 216, 181, 183,
    43, 118, 142, 103, 231, 123, 133, 193, 66, 132, 227, 95, 238, 204, 205, 198, 178, 0, 59, 75, 91,
    29, 72, 31, 175, 153, 200, 148, 152, 1, 139, 184, 4, 118, 63, 69, 248, 106, 109, 4, 91, 6, 68,
    133,
  ]);
  const keypair = Keypair.fromSecretKey(secretKey);
  // Load keypair from secret key in Base58 string
  const secretKeyInBs58 = bs58.encode(secretKey);
  console.log('Secret key in Base58:', secretKeyInBs58);

  verifyKeypair(keypair, publicKey);
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);
