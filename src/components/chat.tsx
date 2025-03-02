'use client'

import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

const socket = io(String(process.env.NEXT_PUBLIC_SERVER_URL_SOCKETIO))

interface Message {
  id: string
  text: string
  from: string
  date: Date
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Garante que o UUID do usuário seja sempre o mesmo enquanto ele estiver no site
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem('userId')
      if (!storedId) {
        storedId = uuidv4()
        localStorage.setItem('userId', storedId)
      }
      setUserId(storedId)
    }
  }, [])

  useEffect(() => {
    const handleMessage = (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg])
    }

    socket.on('message', handleMessage)

    return () => {
      socket.off('message', handleMessage)
    }
  }, [])

  const sendMessage = () => {
    if (input.trim() && userId) {
      const message = {
        id: uuidv4(),
        text: input,
        from: userId,
      }

      // Envia mensagem apenas pelo socket, sem adicioná-la localmente
      socket.emit('message', message)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-2 w-fit md:min-w-sm md:max-w-md shadow-lg rounded-3xl ${
              userId === msg.from
                ? 'bg-blue-500 text-white self-end ms-auto'
                : 'bg-gray-200 text-black self-start'
            }`}
          >
            <div className="flex flex-col">
              <div className="space-x-2">
                <strong
                  className={`text-sm ${msg.from === userId ? 'text-gray-100' : 'text-gray-500'}`}
                >
                  {msg.from === userId ? 'Você' : `user: ${msg.from}`}
                </strong>
                <span className="text-sm">{format(msg.date, 'HH:mm')}</span>
              </div>
              <div className="text-wrap whitespace-pre-line break-words">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
        className="flex p-4 bg-white border-t border-gray-300"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={!userId} // Evita envio antes do ID estar definido
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
