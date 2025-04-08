use anchor_lang::prelude::*;

declare_id!("8ZaLP9NiSpMPdb8vLGKKDpfzqShp22Q3sf661n4euco4");


#[program]
pub mod mi_contrato {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u32, name: String, age: u32) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.counter = amount;
        let persona = &mut ctx.accounts.persona;
        persona.name = name;
        persona.age = age;  
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // Verificar que solo el creador de la cuenta pueda incrementar el contador
        counter.counter += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The counter account that will be incremented
    #[account(
        init,
        payer = payer,
        space = Counter::INIT_SPACE,
        
        seeds = [b"counter"],
        bump,
    )]
    pub counter: Account<'info, Counter>,
    #[account(init, 
        payer = payer, 
        space = Persona::INIT_SPACE, 
        seeds = [b"persona"], 
        bump)]
    pub persona: Account<'info, Persona>,   
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Persona {

    pub name: String,
    pub age: u32,
}
impl Persona {
    pub const INIT_SPACE: usize = 8 + 4 + 100;
}

#[account]
// The #[account] attribute macro is used to define a data structure that will be stored on-chain.
// It automatically adds a discriminator (8 bytes) to the account, which is used to identify
// the account type when deserializing.
// This is why we add 8 bytes in the INIT_SPACE constant below (8 for discriminator + 4 for u32).
pub struct Counter {
    pub counter: u32,
    
}
impl Counter {
    pub const INIT_SPACE: usize = 8 + 4;
}

#[derive(Accounts)]
pub struct Increment<'info> {
    /// The counter account that will be incremented
    #[account(
        mut
    )]
    pub counter: Account<'info, Counter>,
  
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
}
