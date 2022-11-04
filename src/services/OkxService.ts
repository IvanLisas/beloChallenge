import { priceExpirationInMilliseconds } from '../config/Constanst'
import { dataSource } from '../database/dataSourse'
import { EstimatedPrice } from '../entity/EstimatedPrice'
import { Swap } from '../entity/Swap'
import GeneralError from '../errors/ErrorGenerator'
import estipatedPriceRepository from '../repositories/EstimatedPriceRepository'
import { Operation } from '../types/Operation'
import { OrderBook } from '../domain/OrderBook'
import { OrderResponse } from '../types/OrderBookResponse'
import { OrderDetails } from '../types/OrderDetails'
import { OrderReponse } from '../types/OrderResponse'
import { Pairs } from '../types/Pairs'
import requestService from './RequestService'

class OkxService {
  async placeOrder(estimatedPriceId: string): Promise<Swap> {
    const estimatedPrice = await estipatedPriceRepository.findByIdOrFail(estimatedPriceId)
    estimatedPrice.validate()
    const orderResponse = (
      await requestService.post('/api/v5/trade/order', {
        instId: estimatedPrice.instId,
        tdMode: 'cash',
        side: estimatedPrice.operation,
        ordType: 'market',
        sz: estimatedPrice.volume
      })
    ).data
    estimatedPrice.execute()
    await estipatedPriceRepository.save(estimatedPrice)
    const compltedOrder = await this.getOrderDetails(orderResponse[0].ordId, estimatedPrice.instId)
    return await new Swap(estimatedPrice, compltedOrder[0].avgPx).applyFeeAndSpread().save()
  }

  async getOrderDetails(ordId: string, instId: Pairs) {
    const orderResponse = await requestService.get<OrderDetails>('/api/v5/trade/order', { ordId, instId })
    return orderResponse.data
  }

  async optimalPrice(instId: Pairs, volume: string, operation: Operation): Promise<EstimatedPrice> {
    const orderBook = await this.getOrderBook(instId)
    const { buy, sell } = orderBook.getOptimalPrices(volume)
    const expirationDate = new Date(new Date().getTime() + priceExpirationInMilliseconds)
    return await new EstimatedPrice(buy, sell, volume, instId, expirationDate, operation).save()
  }

  async getOrderBook(instId: Pairs): Promise<OrderBook> {
    const orderBookResponse = await requestService.get<OrderResponse>('/api/v5/market/books', {
      instId,
      sz: '500'
    })
    if (orderBookResponse.code !== '0') throw new GeneralError(orderBookResponse.msg, 400)
    return new OrderBook(orderBookResponse.data[0])
  }
}

const okxService = new OkxService()

export default okxService
