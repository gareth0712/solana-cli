import * as borsh from 'borsh';

// ====================== Program Schema =======================
// A) Calculator ===============================================
// Account Data Structure
export class Calculator {
  value = 0;

  constructor(fields: { value: number } | undefined = undefined) {
    if (fields) {
      this.value = fields.value;
    }
  }
}

export const CalculatorSchema = new Map([
  [Calculator, { kind: 'struct', fields: [['value', 'u32']] }],
]);

// Instruction Data Structure
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

export type CalculatorArgs = {
  operation: number;
  operating_value: number;
};

export const CALCULATOR_SIZE = borsh.serialize(CalculatorSchema, new Calculator()).length;
export const CALCULATOR_INSTRUCTIONS_SIZE = borsh.serialize(
  CalculatorInstructionsSchema,
  new CalculatorInstructions(),
).length;
