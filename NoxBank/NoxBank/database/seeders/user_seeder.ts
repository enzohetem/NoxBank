import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Transaction from '#models/transaction'

export default class extends BaseSeeder {
  async run() {
    // Criar usuário Isabella (a golpista no cenário)
    const isabella = await User.updateOrCreate(
      { email: 'isabella@example.com' },
      {
        fullName: 'Isabella Almeida Soares',
        email: 'isabella@example.com',
        password: '123',
        cpf: '123.456.789-00',
        phone: '11987654321',
        balance: 6000.0,
      }
    )

    // Criar usuário Ana (a vítima no cenário)
    const ana = await User.updateOrCreate(
      { email: 'ana@example.com' },
      {
        fullName: 'Ana da Silva',
        email: 'ana@example.com',
        password: '123',
        cpf: '987.654.321-00',
        phone: '11912345678',
        balance: 450.0,
      }
    )

    // Criar usuário João (outro usuário de teste)
    const joao = await User.updateOrCreate(
      { email: 'joao@example.com' },
      {
        fullName: 'João Pedro Santos',
        email: 'joao@example.com',
        password: 'senha123',
        cpf: '456.789.123-00',
        phone: '11999887766',
        balance: 2000.0,
      }
    )

    // Criar transação de Isabella para Ana (simula o "engano" do golpista)
    await Transaction.updateOrCreate(
      {
        senderId: isabella.id,
        receiverId: ana.id,
        amount: 350.0,
      },
      {
        senderId: isabella.id,
        receiverId: ana.id,
        amount: 350.0,
        type: 'PIX',
        status: 'completed',
      }
    )

    // Criar outras transações de exemplo
    await Transaction.updateOrCreate(
      {
        senderId: ana.id,
        receiverId: joao.id,
        amount: 58.0,
      },
      {
        senderId: ana.id,
        receiverId: joao.id,
        amount: 58.0,
        type: 'PIX',
        status: 'completed',
      }
    )

    console.log('✅ Seed concluído!')
    console.log('👤 Usuários criados:')
    console.log(`   - Isabella: ${isabella.email} (senha: senha123)`)
    console.log(`   - Ana: ${ana.email} (senha: senha123)`)
    console.log(`   - João: ${joao.email} (senha: senha123)`)
  }
}
