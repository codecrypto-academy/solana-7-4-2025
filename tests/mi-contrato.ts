import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MiContrato } from "../target/types/mi_contrato";
import { assert } from "chai";

describe("contador", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MiContrato as Program<MiContrato>;

  it("Inicializa el contador", async () => {
    // Genera una clave para la cuenta de datos del contador.
    const contadorData = anchor.web3.Keypair.generate();
    const personaData = anchor.web3.Keypair.generate();
    const provider = anchor.AnchorProvider.env();

    const initialBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    console.log(`Initial balance of counter account: ${initialBalance} lamports`);

    // Llama a la función de inicialización del contrato.
    await program.methods.initialize(10, "Juan", 20).accounts({   
      counter: contadorData.publicKey,  
      persona: personaData.publicKey,
      payer: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([contadorData, personaData, provider.wallet.payer]).rpc();

    // // Obtiene los datos de la cuenta del contador.
    const contadorAccount = await program.account.counter.fetch(contadorData.publicKey);
    const personaAccount = await program.account.persona.fetch(personaData.publicKey);
    const allAccounts = await program.account.counter.all();
    console.log(allAccounts);
    console.log("+++++++++++")
    const cuentaInfo = await provider.connection.getAccountInfo(contadorData.publicKey);
    console.log(cuentaInfo);
    const cuentaRent = await provider.connection.getMinimumBalanceForRentExemption(
      cuentaInfo.space
    );
    console.log("cuentaRent", cuentaRent / 10**9 / 100 , "$");
    const cuentaInfo2 = await provider.connection.getAccountInfo(personaData.publicKey);
    console.log(cuentaInfo2);
    assert.ok(contadorAccount.counter == 10);   
        assert.ok(personaAccount.name == "Juan");
        assert.ok(personaAccount.age == 20);
  });

;
});