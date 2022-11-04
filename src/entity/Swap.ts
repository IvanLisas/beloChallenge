import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { fee, spread } from '../config/Constanst'
import GeneralError from '../errors/ErrorGenerator'
import { AuditableEntity } from './AuditableEntity'
import { EstimatedPrice } from './EstimatedPrice'

@Entity()
export class Swap extends AuditableEntity {
  constructor(estimatedPrice: EstimatedPrice, executedPrice: string) {
    super()
    this.estimatedPrice = estimatedPrice
    this.executedPrice = executedPrice
  }

  @OneToOne(() => EstimatedPrice)
  @JoinColumn()
  estimatedPrice?: EstimatedPrice

  @Column({ nullable: true, type: 'varchar' })
  finalPrice: string | null = null

  @Column({ type: 'varchar' })
  executedPrice: string

  @Column({ type: 'varchar', nullable: true })
  orderId!: string | null

  applyFeeAndSpread(): Swap {
    if (!this.estimatedPrice) throw new GeneralError('Missing estimated price relation', 500)
    if (this.estimatedPrice.operation === 'buy') {
      this.finalPrice = (parseFloat(this.executedPrice) * (1 + fee) * (1 - spread)).toString()
    } else {
      this.finalPrice = (parseFloat(this.executedPrice) * (1 - fee) * (1 + spread)).toString()
    }
    return this
  }
}
