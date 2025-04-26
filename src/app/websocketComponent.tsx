'use client'
import {useEffect, useState} from "react";

export default function WebSocketComponent() {
    // State to know if my socket is connected to the "auth" server or not
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socket.onopen = (event) => {
            console.log("Connected to Auth Server");
            setConnected(true);
        }

        // Behavior of page for when the socket connection is closed.
        socket.onclose = () => {
            console.log("Disconnected from Auth Server");
            setConnected(false);
        }

    }, []);

    return (
        <div>
            {connected ? <p>Connected to server</p> : <p> Connecting...</p>}
        </div>
    )
}
