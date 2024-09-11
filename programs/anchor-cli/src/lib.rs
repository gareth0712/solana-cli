use anchor_lang::prelude::*;

declare_id!("D7TJt87PXKbj61gQ32rNQwsKxoVQn7WiwvjaPXL9oE6G");

#[program]
pub mod anchor_cli {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
