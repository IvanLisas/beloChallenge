import 'reflect-metadata'
import { expressServer } from './server/server'
import { createRoutes } from './routes/_index'
import { dataSource } from './database/dataSourse'
import { Server } from 'http'

export const server = async (port?: number): Promise<Server> => {
  const PORT = process.env.PORT || port || 3000
  createRoutes(expressServer)

  try {
    const connection = await dataSource.initialize()
    console.log(`Connection establish with DB: ${connection.options.database} `)
  } catch (error) {
    console.log(error)
  }

  return expressServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
}
