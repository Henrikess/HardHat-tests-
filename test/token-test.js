const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");

describe("crypto", async () => {

  let owner, wallet1, wallet2, wallet3;
  let Cryptocrypto, crypto;

  beforeEach(async () => {
    [owner, wallet1, wallet2, wallet3] = await ethers.getSigners()

    Cryptotoken = await ethers.getContractFactory("CryptoToken")
    crypto = await Cryptotoken.deploy(21000000)
    await crypto.deployed()
  })
  
    
  it("Teste do TotalSupply", async () => {

    const TotalSupplyExpected = 21000000;

    const TotalSupplyResult = await crypto.totalSupply();

    expect(TotalSupplyExpected).to.equal(TotalSupplyResult);

    console.log('Total supply esperado: ', TotalSupplyExpected, "Total supply identificado :", TotalSupplyResult);

  });

    it("Não deveria transferir um valor menor que o saldo", async () => {
        

        const ownerBalance = await crypto.balanceOf(owner.address);
        //console.log("Saldo do owner", ownerBalance);
        const wallet1Balance = await crypto.balanceOf(wallet1.address);
       // console.log("Saldo do owner", wallet1Balance);
        const wallet2Balance = await crypto.balanceOf(wallet2.address);
        //console.log("Saldo do owner", wallet2Balance);

        await expect(crypto.transfer(wallet1.address, 21000001)).to.be.revertedWith('Insufficient Balance to Transfer')
        
      //  console.log("Saldo do Sender", ownerBalance);
      //  console.log("Saldo do Receiver", wallet1Balance);


    });

    it("Verificando transferencia. O valor deveria ser subtraido do endereco remetente e adicionado ao do destinatario", async function() {

      const currentBalanceOwner = await crypto.balanceOf(owner.address) //estanciando o saldo do remetente - carteira conectada
      const currentBalanceReceiver = await crypto.balanceOf(wallet1.address)//estanciando o saldo do destinatario
  
      const amountSent = 2500 // quantidade a ser enviada
  
      const transferTx = await crypto.transfer(wallet1.address, amountSent)// criando transação
      await transferTx.wait()
  
      const modifiedBalanceOwner = await crypto.balanceOf(owner.address)// Saldo destinatario após a transferencia
      const modifiedBalanceReceiver = await crypto.balanceOf(wallet1.address)// Saldo remetente após a transferencia
  
      expect(parseInt(currentBalanceOwner) - amountSent).to.equal(modifiedBalanceOwner)
      expect(parseInt(currentBalanceReceiver) + amountSent).to.equal(modifiedBalanceReceiver)

    })

    it("Verificando multiplas transações de saida. ", async function() {
      
      const currentBalanceOwner = await crypto.balanceOf(owner.address)
  
      const amountSent = [3000, 200, 55400]

      let totalAmountSent = 0
      
      const transfers = [
        await crypto.transfer(wallet1.address, amountSent[0]),
        await crypto.transfer(wallet2.address, amountSent[1]),
        await crypto.transfer(wallet3.address, amountSent[2])
      ]
  
      for(let i = 0; i < transfers.length; i++) {
        let transferTx = transfers[i]
        transferTx.wait()
        totalAmountSent += amountSent [i]
      }
  
      const modifiedBalanceOwner = await crypto.balanceOf(owner.address)
    
      expect(parseInt(currentBalanceOwner) - totalAmountSent).to.equal(modifiedBalanceOwner)
    })

});