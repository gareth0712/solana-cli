import path from 'path';

import { loadKeypairFromFile, logger, ACCOUNTS_PATH } from '@/utils';

const main = async () => {
  const filePath = path.resolve(ACCOUNTS_PATH, 'new_account.json');
  const { keypair: _keypair, publicKey: _publicKey } = await loadKeypairFromFile(filePath);
};

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
