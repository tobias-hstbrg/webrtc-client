'use client'
import {useEffect, useState, useRef} from "react";

const adjectives: string[] = ["Cool", "Happy", "Fast", "Bright", "Silent", "Wild"];
const animals: string[] = ["Tiger", "Eagle", "Shark", "Panda", "Wolf", "Falcon"];

interface RegisterMessage {
    type: "register";
    source: string;
    payload: RegisterMessagePayload
}

interface RegisterMessagePayload {
    peerId: string;
    displayName: string;
}

// Generates a random name from a selection of words
function generatePeerName(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adj}@${animal}`;
}

// Created random id the peer can register with to the server
// ID range 0 - 10000
function generatePeerId(): string {
    return "peer-" + Math.floor(Math.random() * 10000).toString();
}

export default function WebSocketComponent() {
    // State to know if the socket is connected to the "auth" server or not
    const [connected, setConnected] = useState<boolean>(false);
    // State to track the name of this client
    const [peerName, setPeerName] = useState<string | null>(null);
    // State to track the ID of the peer
    const [peerId, setPeerId] = useState<string | null>(null);

    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socketRef.current = socket;

        socket.onopen = (event) => {
            console.log("Connected to Auth Server");
            setConnected(true);

            const newPeerName = generatePeerName();
            setPeerName(newPeerName);
            console.log("Generated PeerName", newPeerName);

            const peerId: string = generatePeerId();
            setPeerId(peerId);

            const messagePayload: RegisterMessagePayload = {
                peerId: peerId,
                displayName: newPeerName,
            }

            const registerMessage: RegisterMessage = {
                type: "register",
                source: newPeerName,
                payload: messagePayload,
            };

            socket.send(JSON.stringify(registerMessage));
        }

        // Behavior of page for when the socket connection is closed.
        socket.onclose = () => {
            console.log("Disconnected from Auth Server");
            setConnected(false);
        }

        return () => {
            socket.close();
            console.log("Disconnected from Auth Server via cleanup");
        }

    }, []);

    return (
        <div>
            {connected ? <p>Connected to server</p> : <p> Connecting...</p>}
        </div>
    )
}
