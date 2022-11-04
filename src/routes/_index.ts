import okxRouter from './okxRoutes'
import { Express } from 'express'

export const createRoutes = (expressApp: Express): void => {
  expressApp.use('/okx', okxRouter)
}
