import { createServer } from 'http'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  // Adicionando configuração de CORS no Socket.IO
  const io = new Server(server, {
    cors: {
      origin: String(process.env.SITE_URL), // Permite conexões do frontend
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado', socket.id)
    io.emit('message', {
      text: `Novo cliente conectado - ${socket.id}`,
      from: 'server',
    })

    socket.on('message', (msg) => {
      console.log('Mensagem recebida:', msg)

      // Garante que a mensagem tenha um remetente
      if (!msg.from) {
        msg.from = socket.id
      }

      io.emit('message', msg)
    })

    socket.on('disconnect', () => {
      console.log('Cliente desconectado', socket.id)
      io.emit('message', {
        text: `Cliente desconectado - ${socket.id}`,
        from: 'server',
      })
    })
  })

  const PORT = process.env.PORT || 3001
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Servidor rodando na porta ${PORT}`)
  })
})
