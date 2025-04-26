'use client'
import {useWebSocket} from "@/app/hooks/useWebSocket";

export default function WebSocketComponent() {
    const { connected, peerName, peerId } = useWebSocket("ws://localhost:8080/ws");

    return (
        <div>
            {connected ? <p>Connected to server</p> : <p> Connecting...</p>}
        </div>
    )
}
