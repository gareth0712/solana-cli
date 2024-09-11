import * as borsh from 'borsh';

import { NETWORKS, pingProgramFromConnection } from '@/utils';

class MathStuffSum {
  sum = 0;
  constructor(fields: { sum: number } | undefined = undefined) {
    if (fields) {
      this.sum = fields.sum;
    }
  }
}

const MathStuffSumSchema = new Map([[MathStuffSum, { kind: 'struct', fields: [['sum', 'u32']] }]]);

const MATH_STUFF_SIZE = borsh.serialize(MathStuffSumSchema, new MathStuffSum()).length;

// run the following command in cli ahead to ensure you can get the log message properly:
// $ solana logs | grep "<program id deployed on devnet> invoke" -A 3
async function main() {
  const programName = 'p2_math_sum';
  await pingProgramFromConnection(programName, {
    accountSpaceSize: MATH_STUFF_SIZE,
    rpcUrl: NETWORKS.DEVNET,
  });
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  },
);

// =============================================================
/*
  $ solana account 5KPnmh1k3qmJWy9YKABGdxm8ms6BUcVxLvLQcEhmzie
    Public Key: 5KPnmh1k3qmJWy9YKABGdxm8ms6BUcVxLvLQcEhmzie
    Balance: 1 SOL
    Owner: 4jXhdcZXFtcuiXcyFFoR13dux9XLBYW1BMpbWdSdqkms
    Executable: false
    Rent Epoch: 18446744073709551615
    Length: 4 (0x4) bytes
    0000:   01 00 00 00
  $ solana logs | grep "4jXhdcZXFtcuiXcyFFoR13dux9XLBYW1BMpbWdSdqkms invoke" -A 10
    Program 4jXhdcZXFtcuiXcyFFoR13dux9XLBYW1BMpbWdSdqkms invoke [1]
    Program log: Debug output:
    Program log: Account ID: 5KPnmh1k3qmJWy9YKABGdxm8ms6BUcVxLvLQcEhmzie
    Program log: Executable?: false
    Program log: Lamports: RefCell {
      value: 1000000000,
    }
    Program log: Debug output complete.
    Program log: Adding 1 to sum...
    Program log: Current sum is now: 2
    Program 4jXhdcZXFtcuiXcyFFoR13dux9XLBYW1BMpbWdSdqkms consumed 14374 of 200000 compute units
  $ solana account 5KPnmh1k3qmJWy9YKABGdxm8ms6BUcVxLvLQcEhmzie
    Public Key: 5KPnmh1k3qmJWy9YKABGdxm8ms6BUcVxLvLQcEhmzie
    Balance: 1 SOL
    Owner: 4jXhdcZXFtcuiXcyFFoR13dux9XLBYW1BMpbWdSdqkms
    Executable: false
    Rent Epoch: 18446744073709551615
    Length: 4 (0x4) bytes
    0000:   02 00 00 00
*/
// =============================================================
