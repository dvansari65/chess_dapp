import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import chess from "../idl/chess.json"

export const chessProgram = ()=> {
    const {connection} = useConnection()
    const {wallet} = useWallet()
    const provider = new AnchorProvider(connection,wallet as unknown as Wallet,{
        commitment:"confirmed"
    })
    const program = new Program(chess,provider)
    return {program,provider}
}