import { Request, Response } from 'express'
import errorHandler from './errorsHandler'
import { validationResult } from 'express-validator'

export const requestHandler = async <T>(req: Request, res: Response, callback: () => Promise<T>) => {
  try {
    validationResult(req).throw()
    res.status(200).send(await callback())
  } catch (error) {
    if (error instanceof Error) errorHandler(error, res)
  }
}
