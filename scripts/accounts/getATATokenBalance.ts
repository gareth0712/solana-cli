import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

import { logger, NETWORKS } from '@/utils';

const main = async () => {
  // TODO: Refractor to utils
  // Borpa Token Mint Address on Mainnet
  // https://explorer.solana.com/address/9Zo7ga8iTdqonz8VRs8LL8prVk673vfcRx8gERXQ6HAg
  const borpaMintPubKey: PublicKey = new PublicKey('Bv2ajiWdngTyRFabXCKiwGDJh5SEfJwoRPkkTQ2uf6EE');
  // Mainnet wallet public key (One of the holder)
  // https://explorer.solana.com/address/HG7mPoRuSERG8cMjWVYQp8v4nkRuXiR7Y4556bTxkxJT
  const walletPublicKey = new PublicKey('HG7mPoRuSERG8cMjWVYQp8v4nkRuXiR7Y4556bTxkxJT');
  // Derive ATA for Mainnet
  const ata: PublicKey = await getAssociatedTokenAddress(borpaMintPubKey, walletPublicKey);
  logger.log('Associated Token Account (ATA) Address (Mainnet):', ata.toString());

  // Fetch the token balance of the ATA
  const network = NETWORKS.MAINNET;
  const connection: Connection = new Connection(network);
  const tokenBalance = await connection.getTokenAccountBalance(ata);
  // To verify, https://explorer.solana.com/address/9Zo7ga8iTdqonz8VRs8LL8prVk673vfcRx8gERXQ6HAg
  console.log('Token Balance:', tokenBalance.value.uiAmount);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
