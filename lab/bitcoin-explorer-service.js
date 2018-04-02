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
const village_1 = require("./village");
const src_1 = require("../src");
const utility_1 = require("../src/utility");
const schema_1 = require("../src/schema");
const vineyard_bitcoin_1 = require("vineyard-bitcoin");
function startBitcoinMonitor(village, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const model = village.model;
            const bitcoinConfig = village.config.bitcoin;
            const client = vineyard_bitcoin_1.BitcoinBlockReader.createFromConfig(bitcoinConfig);
            const dao = src_1.createEthereumExplorerDao(model);
            console.log('Starting cron');
            const profiler = new utility_1.SimpleProfiler();
            yield src_1.scanBitcoinExplorerBlocks(dao, client, config, profiler);
            profiler.logFlat();
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.startBitcoinMonitor = startBitcoinMonitor;
function createBitcoinVillage(config) {
    return village_1.createVillage(schema_1.getBitcoinExplorerSchema(), config);
}
exports.createBitcoinVillage = createBitcoinVillage;
//# sourceMappingURL=bitcoin-explorer-service.js.map