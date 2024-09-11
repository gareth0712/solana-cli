import * as BufferLayout from '@solana/buffer-layout';
import { Buffer } from 'buffer';

import { logger } from '.';

export const getStringForInstruction = async (operation: number, operating_value: number) => {
  if (operation == 0) {
    return 'reset the example.';
  } else if (operation == 1) {
    return `add: ${operating_value}`;
  } else if (operation == 2) {
    return `subtract: ${operating_value}`;
  } else if (operation == 3) {
    return `multiply by: ${operating_value}`;
  }
};

export const createCalculatorInstructions = async (
  operation: number,
  operating_value: number,
): Promise<Buffer> => {
  logger.success('operation: ', operation);
  logger.success('operating value: ', operating_value);

  const bufferLayout: BufferLayout.Structure<any> = BufferLayout.struct([
    BufferLayout.u32('operation'),
    BufferLayout.u32('operating_value'),
  ]);

  const buffer = Buffer.alloc(bufferLayout.span);
  bufferLayout.encode(
    {
      operation: operation,
      operating_value: operating_value,
    },
    buffer,
  );

  return buffer;
};
