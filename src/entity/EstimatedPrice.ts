import { Column, Entity } from 'typeorm'
import GeneralError from '../errors/ErrorGenerator'
import { Operation } from '../types/Operation'
import { Pairs as Pair } from '../types/Pairs'
import { AuditableEntity } from './AuditableEntity'

@Entity()
export class EstimatedPrice extends AuditableEntity {
  constructor(buy: string, sell: string, volume: string, instId: Pair, expiration: Date, operation: Operation) {
    super()
    this.buy = buy
    this.sell = sell
    this.volume = volume
    this.instId = instId
    this.expiration = expiration
    this.operation = operation
  }

  @Column()
  buy!: string

  @Column()
  sell!: string

  @Column({ type: 'varchar' })
  operation: Operation

  @Column()
  volume!: string

  @Column()
  expiration!: Date

  @Column({ type: 'varchar' })
  instId!: Pair

  @Column({ type: 'boolean', default: false })
  executed = false

  execute() {
    this.executed = true
  }

  validate() {
    if (this.executed) throw new GeneralError('This estimated price has already been executed', 400)
    if (this.expiration.getTime() < new Date().getTime()) throw new GeneralError('Estimated price expired', 400)
  }
}
