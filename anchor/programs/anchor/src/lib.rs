use anchor_lang::prelude::*;

declare_id!("5CrifCndHLJRtxvMGksFgUK9caVEsqB38En6yaWr4C2s");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
