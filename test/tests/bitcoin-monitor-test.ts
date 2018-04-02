require('source-map-support').install()
import { BitcoinModel } from "../../src";
import { assert } from 'chai'
import { BitcoinVillage, createBitcoinVillage, startBitcoinMonitor } from "../../lab"
import { localConfig } from "../config/config"

const second = 1000
const minute = 60 * second

describe('btc-scan', function () {
  this.timeout(10 * minute)
  let village: BitcoinVillage
  let model: BitcoinModel

  beforeEach(async function () {
    village = await createBitcoinVillage(localConfig)
    model = village.model
    await (model.ground as any).regenerate()
    await model.Currency.create({ name: 'Bitcoin' })
  })

  it('from start', async function () {
    await model.LastBlock.create({ currency: 2 })
    console.log('Initialized village')
    await startBitcoinMonitor(village, {
      queue: { maxSize: 10, minSize: 5 },
      maxMilliseconds: 1 * minute
    })
    assert(true)
  })
})