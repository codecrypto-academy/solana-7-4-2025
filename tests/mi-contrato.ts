import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MiContrato } from "../target/types/mi_contrato";
import { assert } from "chai";

describe("contador", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  console.log("provider", anchor.AnchorProvider.env())
  const program = anchor.workspace.MiContrato as Program<MiContrato>;

  it("incrementa el contador", async () => {
    const provider = anchor.AnchorProvider.env();
    

    const [pda, bump] =  anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter")], // Semillas
      program.programId
    );

    const [pdaPersona, bumpPersona] =  anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("persona")], // Semillas
      program.programId
    );

    const instruction1 = await program.methods.initialize(10, "Juan", 20).accountsStrict({
      counter: pda,
      persona: pdaPersona,
      payer: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([provider.wallet.payer]).instruction();

    // Incrementa el contador
    const instruction2 = await program.methods.increment().accounts({
      counter: pda,
    }).signers([provider.wallet.payer]).instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction1, instruction2);
    const txHash = await provider.sendAndConfirm(transaction);
    console.log("txHash", txHash);
    
    // Verifica que el contador se haya incrementado
    const contadorAccount = await program.account.counter.fetch(pda);
    assert.ok(contadorAccount.counter === 11, "El contador debería haberse incrementado a 11");
  })


;
});
