var FidoMeta = artifacts.require("FidoMeta.sol");
var BigNumber = require('big-number');

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');
const helper = require("./helper/truffleTestHelper");


contract("Fido Meta", (accounts) => {
    let totalSupply = 15e9;
    let FidoMeta_INSTANCE;
    

    beforeEach(async function () {
        FidoMeta_INSTANCE = await FidoMeta.new(web3.utils.toWei('100', 'ether'), web3.utils.toWei(totalSupply.toString(), 'ether'));
        
    });


    it("Mint supply", async () => {
        await FidoMeta_INSTANCE.mint(accounts[0], web3.utils.toWei('10', 'ether'));
        let balanceOfAC1 = await FidoMeta_INSTANCE.balanceOf(accounts[0]);
        assert.equal(balanceOfAC1, web3.utils.toWei('110', 'ether'));
    })


    it("total supply", async () => {
        const totalSupply = await FidoMeta_INSTANCE.totalSupply();
        assert.equal(totalSupply, web3.utils.toWei('100', 'ether'));
    })

    it("Burn coin", async () => {
        await FidoMeta_INSTANCE.burn(web3.utils.toWei('10', 'ether'));
        let balanceOfAC1 = await FidoMeta_INSTANCE.balanceOf(accounts[0]);
        assert.equal(balanceOfAC1, web3.utils.toWei('90', 'ether'));
    })

    it("total 15 billian supply exceed.", async () => {
        await truffleAssert.reverts(
            FidoMeta_INSTANCE.mint(accounts[0], web3.utils.toWei(totalSupply.toString(), 'ether')),
            "ERC20Capped: cap exceeded"
        );
    });
    
    it("Community fee", async ()=> {
        await FidoMeta_INSTANCE.setCommunityAddress(accounts[3]);
        await FidoMeta_INSTANCE.transfer(accounts[1], web3.utils.toWei('1', 'ether'));
        await FidoMeta_INSTANCE.transfer(accounts[2], web3.utils.toWei('1', 'ether'), {from: accounts[1]});
        
        const community_balance = await FidoMeta_INSTANCE.balanceOf(accounts[3]);
        assert.equal(community_balance.toString(), web3.utils.toWei('0.05', 'ether'))
    });

    it("Frozen account can not send and receive ", async () => {
        const SENDER_FROZEN_ERR = "Sender account is frozen";
        const RECIEVER_FROZEN_ERR = "Receiver account is frozen";

        await FidoMeta_INSTANCE.freezeAccount(accounts[1], true);
        await truffleAssert.reverts(
            FidoMeta_INSTANCE.transfer(accounts[1], web3.utils.toWei('1', 'ether')),
            RECIEVER_FROZEN_ERR
        );

        await truffleAssert.reverts(
            FidoMeta_INSTANCE.transfer(accounts[0], web3.utils.toWei('1', 'ether'), {from: accounts[1]}),
            SENDER_FROZEN_ERR
        );
    })

    describe("Lock and Unclock", ()=>{
        let FidoMeta_INSTANCE;
        beforeEach(async ()=>{
            FidoMeta_INSTANCE = await FidoMeta.new(web3.utils.toWei('100', 'ether'), web3.utils.toWei(totalSupply.toString(), 'ether'));
            await FidoMeta_INSTANCE.setCommunityAddress(accounts[3]);
            await FidoMeta_INSTANCE.transfer(accounts[1], web3.utils.toWei('10', 'ether'));
            await FidoMeta_INSTANCE.lock(accounts[1]);
        });

        it("after lock balance zero", async ()=>{
            const balance = await FidoMeta_INSTANCE.balanceOf(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('0', 'ether'))
        })

        it("should not lock second time", async ()=>{
            await FidoMeta_INSTANCE.transfer(accounts[1], web3.utils.toWei('10', 'ether'));
            await truffleAssert.reverts(
                FidoMeta_INSTANCE.lock(accounts[1]),
                "Already Locked"
            );
        })

        it("can not unlock untill 3 month", async ()=>{
            await truffleAssert.reverts(
                 FidoMeta_INSTANCE.unLock(accounts[1]),
                "UnLocking period is not opened"
            );
        })

        it("at 4th month should unclock", async ()=>{
            const threeMonthInsecond = 60*60*24*90+1;
            await helper.advanceTime(web3, threeMonthInsecond);
            await FidoMeta_INSTANCE.unLock(accounts[1]);

            const balance = await FidoMeta_INSTANCE.balanceOf(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('2', 'ether'))
        })

        it("if 4th month is skipped then at 5th month", async ()=>{
            const threeMonthInsecond = 60*60*24*120+1;
            await helper.advanceTime(web3, threeMonthInsecond);
            await FidoMeta_INSTANCE.unLock(accounts[1]);

            const balance = await FidoMeta_INSTANCE.balanceOf(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('4', 'ether'))
        })

        it("after 3 month simulating each month unlocks", async ()=>{
            let count = 5;
            let threeMonthInsecond = 60*60*24*90+1; 
            const oneMonth = 60*60*24*30;
            let reqBalance = 0;
            await helper.advanceTime(web3, threeMonthInsecond);
            while(count-- > 0) {
                await FidoMeta_INSTANCE.unLock(accounts[1]);
                
                const balance = await FidoMeta_INSTANCE.balanceOf(accounts[1]);
                reqBalance += 2;
                assert.equal(balance.toString(), web3.utils.toWei(`${reqBalance}`, 'ether'))

                await helper.advanceTime(web3, oneMonth);
            }
        })

        it("after 8th month", async ()=>{
            
            let threeMonthInsecond = 60*60*24*8*30+1;
            await helper.advanceTime(web3, threeMonthInsecond);
            await FidoMeta_INSTANCE.unLock(accounts[1]);
            const balance = await FidoMeta_INSTANCE.balanceOf(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('10', 'ether'));

            await truffleAssert.reverts(
                FidoMeta_INSTANCE.unLock(accounts[1]),
                "All tokens are unlocked"
            );
        })


    })

});
