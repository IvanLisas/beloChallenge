import { Server } from 'http'
import { dataSource } from '../database/dataSourse'
import supertest from 'supertest'
import { server } from '../app'
import { validPairs } from '../config/Constanst'

let expressServer: Server
beforeEach(async () => {
  expressServer = await server(3001)
})

afterEach(async () => {
  expressServer.close()
  await dataSource.destroy()
})

describe('When /okx/optiomal-price is executed ', () => {
  validPairs.forEach(async (pair) => {
    it(`should return 200 when the instId is ${pair}`, async () => {
      const response = await supertest(expressServer).get(`/okx/optimal-price?instId=${pair}&volume=2&side=buy`)
      expect(response.status).toBe(200)
    })
  })

  it('should return 400 when the instId is not valid', async () => {
    const response = await supertest(expressServer).get('/okx/optimal-price?instId=invalid&volume=10&side=buy')
    expect(response.status).toBe(400)
  })

  it('should return 400 when the volume is not valid', async () => {
    const response = await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=invalid&side=buy')
    expect(response.status).toBe(400)
  })

  it('should return 400 when the side is not valid', async () => {
    const response = await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=10&side=invalid')
    expect(response.status).toBe(400)
  })

  it('should return 200 when the side is BUY', async () => {
    const response = await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=2&side=buy')
    expect(response.status).toBe(200)
  })

  it('should return 200 when the side is SELL', async () => {
    const response = await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=0.00001&side=sell')
    expect(response.status).toBe(200)
  })
})

describe('When /okx/place-order is executed ', () => {
  it('should return 400 when the estimatedPriceId is not valid', async () => {
    const response = await supertest(expressServer).post('/okx/place-order').send({ estimatedPriceId: 'invalid' })
    expect(response.status).toBe(400)
  })

  it('should return 200 when the order is executed', async () => {
    const estimatedPrice = (await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=0.00001&side=sell')).body
    const response = await supertest(expressServer).post('/okx/place-order').send({ estimatedPriceId: estimatedPrice.id })
    expect(response.status).toBe(200)
  })

  it('should return 400 when estimatedPrice was already use', async () => {
    const estimatedPrice = (await supertest(expressServer).get('/okx/optimal-price?instId=BTC-USDT&volume=0.00001&side=sell')).body
    await supertest(expressServer).post('/okx/place-order').send({ estimatedPriceId: estimatedPrice.id })
    const response = await supertest(expressServer).post('/okx/place-order').send({ estimatedPriceId: estimatedPrice.id })
    expect(response.status).toBe(400)
  })
})
