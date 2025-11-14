import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pix_alerts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('pix_transaction_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pix_transactions')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // quem recebeu o alerta
      table.string('alert_type').notNullable() // e.g. 'possible_refund_scam'
      table.text('details').nullable()
      table.boolean('resolved').defaultTo(false)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
