import * as borsh from 'borsh';

// ====================== Program Schema =======================
// A) Calculator ===============================================
// Account Data Structure
export class Calculator {
  value = 0;

  constructor(value?: number) {
    if (value) {
      this.value = value;
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

  constructor(operation?: number, operating_value?: number) {
    if (operation) {
      this.operation = operation;
    }
    if (operating_value) {
      this.operating_value = operating_value;
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
