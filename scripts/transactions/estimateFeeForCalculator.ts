import { NETWORKS, CALCULATOR_SIZE, operateCalculator, logger, CalculatorArgs } from '@/utils';

async function main() {
  const programName = 'p4_calculator';

  const args: CalculatorArgs = {
    operation: 1,
    operating_value: 6,
  };

  await operateCalculator(programName, args, {
    accountSpaceSize: CALCULATOR_SIZE,
    rpcUrl: NETWORKS.DEVNET,
    estimateFee: true,
  });
}

main().then(
  () => process.exit(),
  (err) => {
    logger.fail(err);
    process.exit(-1);
  },
);
