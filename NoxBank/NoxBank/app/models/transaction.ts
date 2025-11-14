import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // foreign key column pointing to users.id (DB column: sender_id)
  @column()
  declare senderId: number

  @belongsTo(() => User, { foreignKey: 'senderId' })
  public sender: any

  @column()
  declare type: string

  @column()
  declare amount: number

  @column()
  declare status: string

  // foreign key column pointing to users.id (DB column: receiver_id)
  @column()
  declare receiverId: number

  @belongsTo(() => User, { foreignKey: 'receiverId' })
  public receiver: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}