import { EstimatedPrice } from '../../entity/EstimatedPrice'

export type EstimatedPriceDTO = {
  id: string
  buy: string
  sell: string
  expiration: Date
}

export const createEstimatedPriceDTO = (estimatedPrice: EstimatedPrice): EstimatedPriceDTO => ({
  id: estimatedPrice.id,
  buy: estimatedPrice.buy,
  sell: estimatedPrice.sell,
  expiration: estimatedPrice.expiration
})
