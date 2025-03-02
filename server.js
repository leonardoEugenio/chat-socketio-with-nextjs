import { createServer } from 'http'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(handle)

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado', socket.id)
    io.emit('message', {
      text: `Novo cliente conectado - ${socket.id}`,
      from: 'server',
      date: new Date(),
    })

    socket.on('message', (msg) => {
      console.log('Mensagem recebida:', msg)
      io.emit('message', { ...msg, from: msg.from, date: new Date() })
    })

    socket.on('disconnect', () => {
      console.log('Cliente desconectado', socket.id)
      io.emit('message', {
        text: `Cliente desconectado - ${socket.id}`,
        from: 'server',
        date: new Date(),
      })
    })
  })

  const PORT = process.env.PORT || ''
  server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
})
