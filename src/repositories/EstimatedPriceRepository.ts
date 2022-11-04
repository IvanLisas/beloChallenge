import { EstimatedPrice } from '../entity/EstimatedPrice'
import getRepository from './_Repostiory'

const repo = getRepository(EstimatedPrice)

const estipatedPriceRepository = getRepository(EstimatedPrice).extend({
  ...repo
})

export default estipatedPriceRepository
