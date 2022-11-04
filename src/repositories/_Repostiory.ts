import { EntityTarget, FindOptionsWhere, FindManyOptions, FindOptionsRelations } from 'typeorm'
import { dataSource } from '../database/dataSourse'
import { AuditableEntity } from '../entity/AuditableEntity'
import { EntityDontFoundError } from '../errors/ErrorGenerator'

//Todos los repositorios deben extender de esta funcion
const getRepository = <Entity extends AuditableEntity>(target: EntityTarget<Entity>) => {
  const database = dataSource
  return database.getRepository(target).extend({
    // Funciones que comparten todos los repos, la condicion a buscar debe estar en "AuditableEntity"

    async findByConditionOrFail(
      condition: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[] | undefined,
      relations?: string[] | FindOptionsRelations<Entity>
    ) {
      const entity = target as new () => Entity // Para obtener el nombre de la clase
      const data = await this.findOne({ where: condition, relations })
      if (!data) throw new EntityDontFoundError(entity.name, condition)
      return data as Entity
    },

    async findByIdOrFail(id: string, relations?: string[] | FindOptionsRelations<Entity>) {
      const findOptions: FindManyOptions<Entity> = { where: { id } } as FindManyOptions<Entity>
      return (await this.findByConditionOrFail(findOptions.where, relations)) as Entity
    }
  })
}

export default getRepository
