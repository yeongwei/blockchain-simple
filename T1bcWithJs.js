const SHA256 = require("crypto-js/sha256");

const getCurrentDatetTime = function() { return (new Date()).toString() }

class Block {
    /**
     * 
     * @param {*} index position of this block in the chain
     * @param {*} timestamp when this block was created
     * @param {*} data Any data associated with this block E.g. Transaction
     * @param {*} previousHash String of the hash value for the previous block. Important for integrity of the entire Block Chain
     */
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, getCurrentDatetTime(), "Genesis Block", "No previous block obviously!");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateHash()) return false;

            if (currentBlock.previousHash != previousBlock.hash) return false;
        }

        return true;
    }
}

console.log("\nTest Code starts here...");

let cryptoCoin = new BlockChain();

console.log("\nInitiated Block Chain");

cryptoCoin.addBlock(new Block(1, getCurrentDatetTime(), { amount: 1 }));
cryptoCoin.addBlock(new Block(2, getCurrentDatetTime(), { amount: 10 }));
cryptoCoin.addBlock(new Block(3, getCurrentDatetTime(), { amount: 100 }));

console.log("\nAdded 3 Blocks");

console.log("\nNow the Block Chain looks like\n\n" + JSON.stringify(cryptoCoin, null, 4));

console.log("\nCheck that Block Chain is valid? " + cryptoCoin.isChainValid());

console.log("\nAttempt to hamper Block Chain");
cryptoCoin.chain[1].data = { amount: 10000000 };

console.log("\nCheck that Block Chain is valid? " + cryptoCoin.isChainValid());

console.log("\nAttempt to hack the hash");
cryptoCoin.chain[1].hash = cryptoCoin.chain[1].calculateHash();

console.log("\nCheck that Block Chain is valid? " + cryptoCoin.isChainValid());

console.log("\nNow the Block Chain looks like\n\n" + JSON.stringify(cryptoCoin, null, 4));
