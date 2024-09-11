import { pingProgramFromConnection } from '@/utils';

// run the following command in CLI ahead to ensure you can get the log message properly:
// $ solana logs | grep "<program id deployed on devnet> invoke" -A 3
async function main() {
  const programName = 'p1_hello_solana';
  await pingProgramFromConnection(programName);
}

main().then(
  () => process.exit(),
  (err) => {
    console.log('Error occurred running the cli program');
    console.error(err);
    process.exit(-1);
  },
);

// =============================================================
/*
  If you have run the following command in CLI ahead, you shd see the logs upon finishing executing this program, for my case: 
  % solana logs | grep "E348xRRhGTz2nqwb8GFeug39PaHQdTEtLoh1w71xMk5N invoke" -A 3
  Program E348xRRhGTz2nqwb8GFeug39PaHQdTEtLoh1w71xMk5N invoke [1]
  Program log: Hello Solana! (From Rust!)
  Program E348xRRhGTz2nqwb8GFeug39PaHQdTEtLoh1w71xMk5N consumed 340 of 200000 compute units
  Program E348xRRhGTz2nqwb8GFeug39PaHQdTEtLoh1w71xMk5N success
*/
// =============================================================
