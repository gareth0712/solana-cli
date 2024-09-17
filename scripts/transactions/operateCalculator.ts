import { NETWORKS, CALCULATOR_SIZE, operateCalculator, logger, CalculatorArgs } from '@/utils';

// run the following command in cli ahead to ensure you can get the log message properly:
// $ solana logs | grep "<program id deployed on devnet> invoke" -A 20
async function main() {
  const programName = 'p4_calculator';

  const args: CalculatorArgs = {
    operation: 1,
    operating_value: 6,
  };

  await operateCalculator(programName, args, {
    accountSpaceSize: CALCULATOR_SIZE,
    rpcUrl: NETWORKS.DEVNET,
  });
}

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
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
