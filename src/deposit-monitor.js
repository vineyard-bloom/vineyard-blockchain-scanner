"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vineyard_blockchain_1 = require("vineyard-blockchain");
class DepositMonitor {
    constructor(model, client, currency, minimumConfirmations, transactionHandler) {
        this.model = model;
        this.client = client;
        this.currency = currency;
        this.minimumConfirmations = minimumConfirmations;
        this.transactionHandler = transactionHandler;
    }
    convertStatus(highestBlock, source) {
        return highestBlock - source.blockIndex >= this.minimumConfirmations
            ? vineyard_blockchain_1.blockchain.TransactionStatus.accepted
            : vineyard_blockchain_1.blockchain.TransactionStatus.pending;
    }
    saveExternalTransaction(source, blockIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.model.getTransactionByTxid(source.txid);
                if (existing) {
                    // handle uncle block stuff here
                    return existing;
                }
            }
            catch (error) {
                console.error('Error checking for existing transaction', error, source);
                return undefined;
            }
            try {
                const transaction = yield this.model.saveTransaction({
                    txid: source.txid,
                    to: source.to,
                    from: source.from,
                    status: this.convertStatus(blockIndex, source),
                    amount: source.amount,
                    timeReceived: source.timeReceived,
                    blockIndex,
                    currency: this.currency.id
                });
                this.transactionHandler.onSave(transaction);
                if (blockIndex - source.blockIndex >= this.minimumConfirmations) {
                    return yield this.transactionHandler.onConfirm(transaction);
                }
            }
            catch (error) {
                console.error('Error saving transaction', error, source);
                return undefined;
            }
        });
    }
    saveExternalTransactions(transactions, blockIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let transaction of transactions) {
                if (yield this.transactionHandler.shouldTrackTransaction(transaction)) {
                    yield this.saveExternalTransaction(transaction, blockIndex);
                }
            }
        });
    }
    confirmExistingTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const ExternalTransaction = yield this.model.setTransactionStatus(transaction, vineyard_blockchain_1.blockchain.TransactionStatus.accepted);
            return yield this.transactionHandler.onConfirm(ExternalTransaction);
        });
    }
    updatePendingTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionFromDatabase = yield this.model.getTransactionByTxid(transaction.txid);
            if (transactionFromDatabase && transactionFromDatabase.status == vineyard_blockchain_1.blockchain.TransactionStatus.pending)
                return yield this.confirmExistingTransaction(transaction);
            return transaction;
        });
    }
    scanBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            let lastBlock = yield this.model.getLastBlock();
            do {
                const offsetAmount = lastBlock && !!(lastBlock.blockIndex) ? lastBlock.blockIndex - this.minimumConfirmations : 0;
                const offsetBlockIndex = offsetAmount > 0 ? offsetAmount : 0;
                yield this.gatherTransactions({ blockIndex: offsetBlockIndex, currency: this.currency.id });
                lastBlock = yield this.gatherTransactions(lastBlock);
            } while (lastBlock);
        });
    }
    gatherTransactions(lastBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockInfo = yield this.client.getNextBlockInfo(!!lastBlock ? lastBlock.blockIndex : 0);
            if (!blockInfo)
                return undefined;
            const fullBlock = yield this.client.getFullBlock(blockInfo.index);
            if (!fullBlock) {
                console.error('Invalid block', blockInfo);
                return undefined;
            }
            const block = {
                blockIndex: fullBlock.index,
                currency: this.currency.id
            };
            if (!fullBlock.transactions) {
                return block;
            }
            yield this.saveExternalTransactions(fullBlock.transactions, block.blockIndex);
            return this.model.setLastBlock(block);
        });
    }
    updatePendingTransactions(maxBlockIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.model.listPending(maxBlockIndex);
            for (let transaction of transactions) {
                try {
                    yield this.updatePendingTransaction(transaction);
                }
                catch (error) {
                    console.error('Bitcoin Transaction Pending Error', error, transaction);
                }
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this.client.getBlockIndex();
            yield this.updatePendingTransactions(block - this.minimumConfirmations);
            yield this.scanBlocks();
        });
    }
}
exports.DepositMonitor = DepositMonitor;
//# sourceMappingURL=deposit-monitor.js.map