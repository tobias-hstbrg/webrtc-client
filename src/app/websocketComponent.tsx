'use client'

import { useEffect, useState } from 'react'

export default function WebSocketComponent() {
    const [messages, setMessages] = useState<string[]>([])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws')

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data])
        }

        socket.onopen = () => {
            console.log('Connected to WebSocket')
        }

        socket.onerror = (err) => {
            console.error('WebSocket error:', err)
        }

        return () => {
            socket.close()
        }
    }, [])

    return (
        <div>
            <h2>WebSocket Messages</h2>
            <ul>
                {messages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}
