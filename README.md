# Solana Client

This repo provides necessary scripts for connecting to Solana network, interacting with Solana
System programs and other executable programs.

## Installation

- Install Solana Client packages

```shell
yarn
```

- To run any scripts in scripts/ directory, use the following command

```shell
yarn start <script_name>
```

for example, to run `scripts/transactions/operateCalculator.ts`

```shell
yarn start operateCalculator
```

- You can create a new account to the "accounts/" directory for use in scripts using the following
  command

```shell
solana-keygen new --no-bip39-passphrase -o accounts/<account_name>.json
```

## Solana CLI for Solana program

### Wallet related commands

1. Create a wallet

```shell
$ solana-keygen new
```

- Upon installation of Solana cli, there will not be any default wallet so once you enter this
  command, a default wallet will be set for you with its keypair saved to `~/.config/solana/id.json`
- This command will prompt you to specify a passphrase (optional) to encrypt your private key. If
  you don’t want to use a passphrase, you can just press Enter.
- After creating the keypair, the public key (your wallet address) and the path where your wallet
  file is stored will be displayed.
- For commands that require input of pubkey, if not supplied, some commands will use the default
  wallet pubkey.
- To create more wallet addresses, use the following command

```shell
$ solana-keygen new --no-bip39-passphrase -o <path/to/keypair.json>
```

2. Get public key of default keypair wallet (If keypair.json file is not given, default wallet is
   used)

```shell
$ solana-keygen pubkey <path/to/keypair.json>
```

OR

```shell
$ solana address
```

3. Airdrop some SOL to the given wallet pubkey (default wallet if pubkey is not given)

```shell
$ solana airdrop 3 <pubkey>
```

or, to specify keypair file

```shell
$ solana airdrop 3 --keypair <path/to/keypair.json>
```

4. Get content of the account with given pubkey

```shell
$ solana account <pubkey>

Public Key: <pubkey>
Balance: 23.00969408 SOL
Owner: 11111111111111111111111111111111
Executable: false
Rent Epoch: 18446744073709551615
```

5. Get balance of given wallet pubkey (default wallet if pubkey is not given)

```shell
$ solana airdrop 3 <pubkey>
```

6. get file path of the default wallet

```shell
$ solana config get

Config File: /Users/garethlau/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/garethlau/.config/solana/id.json
Commitment: confirmed
```

7. Change the default wallet filepath

```shell
$ solana config set -k <absolute/path/to/keypair.json>
```

8. Get Public Key (both program and wallet are applicable) from keypair

```shell
$ solana address -k target/deploy/hello_world_example-keypair.json
6RTLRg3mjopTSDCfEPjEwT2siszbYE7EcafkXw3mT2rS
```

### Program related commands

- Init a new Solana program for development

```shell
$ cargo init --lib <program_name>
```

- Compile a program to generate `target/` directory and `program.so` file

```shell
$ cd <directory with cargo.toml>
$ cargo build-bpf
```

- Deploy program (You must have compiled a program using the command above)

```shell
$ cd <directory with .so file, usually in target/deploy/>
$ solana program deploy program.so
```

## Anchor CLI (Work in progress)

- Init a new Anchor program

```

anchor init <project_name>

```

- create a new program

```

cd <project_name> anchor new <program_name>

```

- Build the program

```

anchor build

```

- Test the program

```

anchor test

```

```

```
