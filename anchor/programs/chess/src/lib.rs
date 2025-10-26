use std::vec;

use anchor_lang::prelude::*;

declare_id!("5CrifCndHLJRtxvMGksFgUK9caVEsqB38En6yaWr4C2s");

#[program]
pub mod chess {
    use super::*;

    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        user_1: String,
        wagered_amount:u64
    ) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(game_id:u64)]
pub struct InitializeGame<'info> {
    #[account(init , space = 8 + 8  , payer = user_1, seeds = [b"game",game_id.to_le_bytes().as_ref()], bump)]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        seeds = [b"escrow",game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game_escrow: SystemAccount<'info>,

    #[account(mut)]
    pub user_1: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
struct Game {
    pub game_id: u64,
    pub user_1: String,
    pub amount_wagered: u64,
    pub game_status: GameStatus,
    pub winner: Option<Pubkey>,
}
#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq, InitSpace)]
pub enum GameStatus {
    WaitingForPlayer2,
    InProgress,
    Completed,
}
