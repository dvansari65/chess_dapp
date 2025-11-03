import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {Chess} from "../target/types/chess"
import { BN } from "bn.js";

describe("anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchor as Program<Chess>;

  it("Is initialized!", async () => {
    const gameId = new BN(112823);
    const [gamePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [gameId.toArrayLike(Buffer,"le",8)],
      program.programId
    )
    try {
      const account = await program.account.game.fetch(gamePda)
    } catch (error) {
      
    }
  });
});
