import {useEffect, useState, useRef} from "react";
import {RegisterMessage} from "@/app/types/RegisterMessage";
import {RegisterMessagePayload} from "@/app/types/RegisterMessagePayload";
import { toast } from "sonner";

const adjectives: string[] = ["Cool", "Happy", "Fast", "Bright", "Silent", "Wild"];
const animals: string[] = ["Tiger", "Eagle", "Shark", "Panda", "Wolf", "Falcon"];

// Generates a random name from a selection of words
function generatePeerName(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * adjectives.length)];
    return `${adj}@${animal}`;
}

// Created random id the peer can register with to the server
// ID range 0 - 10000
function generatePeerId(): string {
    return "peer-" + Math.floor(Math.random() * 10000).toString();
}

export function useWebSocket(url: string) {
    // State to know if the socket is connected to the "auth" server or not
    const [connected, setConnected] = useState<boolean>(false);
    // State to track the name of this client
    const [peerName, setPeerName] = useState<string | null>(null);
    // State to track the ID of the peer
    const [peerId, setPeerId] = useState<string | null>(null);
    // Reference to the created socket
    const socketRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socketRef.current = socket;

        socket.onopen = (event) => {
            console.log("Connected to Auth Server");
            setConnected(true);
            toast.success("Connected", {
                description: "You are connected to Auth Server",
            })

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
            toast.info("Disconnected from Auth Server");
        }

        return () => {
            socket.close();
            console.log("Disconnected", {
                description: "The connection to the Auth Server has been disconnected",
            });
        }

    }, [url]);
    return {connected, peerName, peerId};
}