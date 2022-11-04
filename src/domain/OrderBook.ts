import GeneralError from '../errors/ErrorGenerator'
import { OrderResponse, Orders } from '../types/OrderBookResponse'

export class OrderBook {
  constructor(public orderResponse: OrderResponse) {
    this.buyOrders = orderResponse.bids
    this.sellOrders = orderResponse.asks
  }

  buyOrders: Orders
  sellOrders: Orders

  getOptimalPrices(volume: string): { buy: string; sell: string } {
    const buy = this.getOptimalPrice(volume, this.buyOrders)
    const sell = this.getOptimalPrice(volume, this.sellOrders)
    return { buy, sell }
  }

  getOptimalPrice(volume: string, orders: Orders): string {
    let totalVolume = 0
    const averagePrices: number[] = []
    while (totalVolume < Number(volume)) {
      const order = orders.shift()
      if (!order) throw new GeneralError('Not enough orders', 400)
      totalVolume += Number(order[1])
      if (totalVolume > Number(volume)) {
        const neededVolume = Number(volume) - (totalVolume - Number(order[1]))
        averagePrices.push(Number(order[0]) * neededVolume)
      } else averagePrices.push(Number(order[0]) * Number(order[1]))
    }
    return (averagePrices.reduce((acc, curr) => acc + curr, 0) / +volume).toString()
  }
}
