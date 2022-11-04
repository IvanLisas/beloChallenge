/* eslint-disable @typescript-eslint/no-explicit-any */
class GeneralError extends Error {
  constructor(public message: string, public code: number) {
    super()
  }
}

export class EntityDontFoundError extends GeneralError {
  constructor(entity: string, condition: any) {
    super(`${entity} ${condition && 'with ' + Object.keys(condition) + ':' + Object.values(condition)} not found `, 404)
  }
}

export default GeneralError
