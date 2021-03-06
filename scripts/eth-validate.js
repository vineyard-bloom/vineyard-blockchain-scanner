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
const client_functions_1 = require("vineyard-ethereum/src/client-functions");
const Web3 = require('web3');
const config = require('../config/config');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumConfig.ethereum.client.http));
// TODO Separate SQL code for validating that block parentHash is right
function main(startBlock, endBlock) {
    return __awaiter(this, void 0, void 0, function* () {
        let blockNumber = startBlock ? startBlock : 0;
        let web3Block = web3.eth.getBlock(blockNumber);
        // update to the correct db select
        // TODO: this needs to be updated to an actual db selection.
        let dbBlock = web3.eth.getBlock(blockNumber);
        // const block = await model.Block.filter({ 'number': blockNumber }).first()
        // const parentBlockHash: string = await getParentBlockHash(model, blockNumber - 1) // needs updating
        // This function will be returning error messages, as such, it seems that this is the first area
        //   that we really need to deal with these messages in a standardized way. Printing them all out as they come up is easy.
        //   the more challenging aspect is to, in a clean way, log all the errors at the very end
        client_functions_1.validateBlock(web3Block, dbBlock) // I am not 100% sure that this _needs_ to be a promise, should double check on this.
            .then((resolved) => {
            console.log('resolved', resolved);
        });
    });
}
exports.main = main;
const blockNumber = 5787517;
main(blockNumber);
//# sourceMappingURL=eth-validate.js.map