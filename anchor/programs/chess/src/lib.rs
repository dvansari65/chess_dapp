use std::vec;
use anchor_lang::prelude::*;
use anchor_lang :: system_program :: {transfer,Transfer};

declare_id!("5thRjLC5weq2vHC4VnDP1irNgNpdqCRmLEN6RqBtHvwt");

#[program]
pub mod chess {

    use super::*;
   
    pub fn create_game(
        ctx: Context<InitializeGame>,
        game_id: u64,
        wagered_amount:u64
    ) -> Result<()> {
        require!(wagered_amount > 0 , ChessError::InvalidWageredAmount);
        let player_balance= ctx.accounts.player_1.to_account_info().lamports();
        require!(player_balance >= wagered_amount , ChessError::InvalidWageredAmount);
        let game = &mut ctx.accounts.game;
        let escrow = &mut ctx.accounts.game_escrow;
        escrow.amount_status = AmountStatus::NotObtainedYet;
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from:ctx.accounts.player_1.to_account_info(),
                to:escrow.to_account_info()
            }
        );
        transfer(cpi_context, player_balance)?;
        escrow.amount_status = AmountStatus::ObtainedFromPlayer1;
        msg!("Wagered transfer from player 1 to escrow account");
        game.amount_wagered = wagered_amount;
        game.game_id = game_id;
        game.game_status = GameStatus::WaitingForPlayer2;
        game.player_1 =  ctx.accounts.player_1.key();
        game.player_2 = Pubkey::default();
        game.bump = ctx.bumps.game;
        msg!("Game created ! ID : {} , Wagered Amount :{}", game_id,wagered_amount);
        Ok(())
    }
    pub fn join_game (ctx: Context<InitializeJoinGame>,game_id:u64,wagered_amount:u64)-> Result<()>{
        let game= &mut ctx.accounts.join_game;
        require!(wagered_amount > 0 , ChessError::InvalidWageredAmount);
        let player_balance = ctx.accounts.player_2.to_account_info().lamports();
        require!(player_balance >= wagered_amount , ChessError::InvalidWageredAmount);
        let escrow = &mut ctx.accounts.game_escrow;
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from:ctx.accounts.player_2.to_account_info(),
                to:escrow.to_account_info()
            }
        );
        transfer(cpi_context, player_balance)?;
        escrow.amount_status = AmountStatus::ObtainedFromPlayer2;
        game.amount_wagered = wagered_amount;
        game.game_id = game_id;
        game.bump = ctx.bumps.join_game;
        game.game_status = GameStatus::Player2Connected;
        Ok(())
    }
    pub fn initialize_escrow(ctx: Context<InitializeEscrow>,game_id: u64)->Result<()>{
        let (expected_pda,_bump) = Pubkey::find_program_address(
            &[b"escrow",game_id.to_le_bytes().as_ref()],
             ctx.program_id
            );
            require_keys_eq!(expected_pda,ctx.accounts.escrow.key(),ChessError::InvalidPda);
            let escrow = &mut ctx.accounts.escrow;
            escrow.game_id = game_id;
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(game_id:String)]
pub struct InitializeGame<'info> {
    #[account(init , space = 8 + 8  , payer = player_1, seeds = [b"game",game_id.as_bytes().as_ref()], bump , has_one = player_1)]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        seeds = [b"escrow",game_id.as_bytes().as_ref().as_ref()],
        bump
    )]
    pub game_escrow: Account<'info,Escrow>,
    #[account(mut)]
    pub player_1: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_id:u64)]
pub struct InitializeJoinGame <'info>{
    #[account(init, payer = player_2 , space = 8 + 8  , seeds = [b"game",game_id.to_le_bytes().as_ref()] ,bump)]
    pub join_game : Account<'info,Game>,
    #[account(
        mut,
        seeds = [b"escrow",game_id.to_be_bytes().as_ref()],
        bump
    )]
    pub game_escrow : Account<'info,Escrow>,
    #[account(mut)]
    pub player_2 : Signer<'info>,
    system_program : Program<'info,System>
}

#[derive(Accounts)]
#[instruction(game_id:u64)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + Escrow::INIT_SPACE, 
        seeds = [b"escrow",game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub escrow : Account<'info,Escrow>,
    #[account(mut)]
    pub signer : Signer<'info>,
    pub system_program : Program<'info,System>
}

#[account]
struct Game {
    pub game_id: u64,
    pub player_1: Pubkey,
    pub player_2:Pubkey,
    pub amount_wagered: u64,
    pub game_status: GameStatus,
    pub winner: Option<Pubkey>,
    pub bump:u8
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq, InitSpace)]
enum GameStatus {
    Processing,
    Player2Connected,
    WaitingForPlayer2
}
#[error_code]
pub enum ChessError {
    #[msg("Invalid wagered amount!")]
    InvalidWageredAmount,
    #[msg("Invalid PDA found!")]
    InvalidPda
}
#[error_code]
pub enum  PlayerError {
    #[msg("User name length should be less than 20 characters!")]
    InvalidUserNameLength
}
#[error_code]
pub enum EscrowError {
    #[msg("Game id not provided!")]
    GameIdError
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    game_id:u64,
    #[max_len(20)]
    player_1:String,
    #[max_len(20)]
    player_2:String,
    wagered_amount:u64,
    amount_status:AmountStatus
}

#[derive(Clone,InitSpace,AnchorDeserialize,AnchorSerialize)]
pub enum AmountStatus {
    NotObtainedYet,
    ObtainedFromPlayer1,
    ObtainedFromPlayer2,
    Returned
}
