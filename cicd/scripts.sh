#!/bin/bash

# Accept parameters passed to the script
operation=$1

# Define the path to the TypeScript scripts directory
script_dir="scripts"

# Define the TypeScript file to be run (with a .ts extension)
ts_file=$(find "$script_dir" -name "$operation.ts" -type f)

# Check if the file exists
if [ -f "$ts_file" ]; then
  # If the file exists, run it using yarn tsx
  echo "Running script: $ts_file"
  yarn tsx "$ts_file"
else
  # If the file does not exist, print an error message
  echo "Error: Script '$ts_file' does not exist. Please ensure your input script exists in scripts/ directory."
  exit 1
fi