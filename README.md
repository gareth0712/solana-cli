# Solana Client

This repo provides necessary scripts for connecting to Solana network, interacting with Solana System programs and other executable programs.

## Client side handling

- Install Solana Client packages

```
yarn
```

## CLI for Solana program

- Init a new Solana program for development

```
$ cargo init --lib <program_name>
```

- Compile a program to generate `target/` directory and `program.so` file

```
$ cd <directory with cargo.toml>
$ cargo build-bpf
```

- Deploy program (You must have compiled a program using the command above)

```
$ cd <directory with .so file, usually in target/deploy/>
$ solana program deploy program.so
```
