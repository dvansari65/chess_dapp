import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {Chess} from "../target/types/chess"
import { assert } from "chai";
import { BN } from "bn.js";

describe("anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.chess as Program<Chess>;
  const [gameIdPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("counter"),
    ],
    program.programId
  )

  it("Is initialized!", async () => {
    console.log("test started!")
   
   try {
     const tx = await program.methods
     .initializeGameId()
     .rpc()
     const account = await program.account.counter.fetch(gameIdPda)
    console.log("tx",tx)
    console.log("Account",account.gameId)
    assert(account.gameId.eq(new BN(0)))
   } catch (error) {
      throw error;
   }
  });
  it("create game initialized",async()=>{
    console.log("Create game initialize.....")
    const wagerAmount = new BN(1_000_000_000);
    const counterAccount = await program.account.counter.fetch(gameIdPda)
    const gameId = counterAccount.gameId.toNumber()
    const nextGameId = gameId + 1;
    try {
      const tx = await program.methods
      .createGame(wagerAmount)
      .accounts({
        player1:provider.wallet.publicKey
      })
      .rpc()
      const createGameAcount = await program.account.counter.fetch(gameIdPda)
      console.log("Updated game counter:", createGameAcount.gameId.toString());
      assert(createGameAcount.gameId.eq(new BN(nextGameId)))
    } catch (error) {
      
    }
  })
});
