import * as borsh from 'borsh';

import { NETWORKS, operateAdvancedCounterFromConnection } from '@/utils';

// --------------------------------------------------------

/*
Account Data
*/

// TODO: multicall, event listeners, etc.
class Calculator {
  value = 0;
  constructor(fields: { value: number } | undefined = undefined) {
    if (fields) {
      this.value = fields.value;
    }
  }
}

const CalculatorSchema = new Map([[Calculator, { kind: 'struct', fields: [['value', 'u32']] }]]);

const CALCULATOR_SIZE = borsh.serialize(CalculatorSchema, new Calculator()).length;

// --------------------------------------------------------

/*
Instruction Data
*/

export class CalculatorInstructions {
  operation = 0;
  operating_value = 0;
  constructor(fields: { operation: number; operating_value: number } | undefined = undefined) {
    if (fields) {
      this.operation = fields.operation;
      this.operating_value = fields.operating_value;
    }
  }
}

export const CalculatorInstructionsSchema = new Map([
  [
    CalculatorInstructions,
    {
      kind: 'struct',
      fields: [
        ['operation', 'u32'],
        ['operating_value', 'u32'],
      ],
    },
  ],
]);

export const CALCULATOR_INSTRUCTIONS_SIZE = borsh.serialize(
  CalculatorInstructionsSchema,
  new CalculatorInstructions(),
).length;

type CalculatorArgs = {
  operation: number;
  operatingValue: number;
};

// run the following command in cli ahead to ensure you can get the log message properly:
// $ solana logs | grep "<program id deployed on devnet> invoke" -A 20
async function main() {
  const programName = 'p4_calculator';
  // p4 and p6 are similar
  // const programName = 'p6_advanced_counter';
  const args: CalculatorArgs = {
    operation: 1,
    operatingValue: 5,
  };

  await operateAdvancedCounterFromConnection(programName, args, {
    accountSpaceSize: CALCULATOR_SIZE,
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
  % solana account 5ZrrH46dGVRw25P2oHBaMKFCR2D1LjVTwPuc3BFFoqLj
    Public Key: 5ZrrH46dGVRw25P2oHBaMKFCR2D1LjVTwPuc3BFFoqLj
    Balance: 1 SOL
    Owner: 356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR
    Executable: false
    Rent Epoch: 18446744073709551615
    Length: 4 (0x4) bytes
    0000:   00 00 00 00
  % solana logs | grep "356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR invoke" -A 10
    Program 356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR invoke [1]
    Program log: Value is now: 5
    Program 356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR consumed 747 of 200000 compute units
    Program 356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR success
  Transaction executed in slot 322456388:
    Signature: 43eQj6ChFUBz2QX1UEbocg2YCu4B4gJ6PudsTBeR9e5kpahRmMcn5opedTEqWsGQygaaBPBAiQJsvGq1j8E81yXA
    Status: Ok
    Log Messages:
      Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]
      Program log: CreateIdempotent
      Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 11838 of 200000 compute units
  % solana account 5ZrrH46dGVRw25P2oHBaMKFCR2D1LjVTwPuc3BFFoqLj
    Public Key: 5ZrrH46dGVRw25P2oHBaMKFCR2D1LjVTwPuc3BFFoqLj
    Balance: 1 SOL
    Owner: 356bh1oaoAZLvuJkS4i9ma9QdxEkBiCcAaef1d7p75XR
    Executable: false
    Rent Epoch: 18446744073709551615
    Length: 4 (0x4) bytes
    0000:   05 00 00 00
*/
// =============================================================
