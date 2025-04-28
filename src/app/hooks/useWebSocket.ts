import {useEffect, useState, useRef} from "react";
import {RegisterMessage} from "@/app/types/RegisterMessage";
import {RegisterMessagePayload} from "@/app/types/RegisterMessagePayload";
import { toast } from "sonner";
import {ServerMessage} from "@/app/types/ServerMessage";
import {Peer} from "@/app/types/Peer";
import {HeartbeatMessage} from "@/app/types/heartbeatMessage";
import {setInterval} from "timers";

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

function sendHeartbeat(socket: WebSocket, peerId: string): void {
    const heartbeatMessage: HeartbeatMessage = {
        type: "heartbeat",
        source: peerId,
    }

    socket.send(JSON.stringify(heartbeatMessage));
    console.log("Heartbeat send to server!");

}

export function useWebSocket(url: string) {
    // State to know if the socket is connected to the "auth" server or not
    const [connected, setConnected] = useState<boolean>(false);
    // State to track the name of this client
    const [peerName, setPeerName] = useState<string | null>(null);
    // State to track the ID of the peer
    const [peerId, setPeerId] = useState<string | null>(null);

    // Peer List
    const [peers, setPeers] = useState<Peer[]>([]);

    // Reference to the created socket
    const socketRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socketRef.current = socket;

        const newPeerName = generatePeerName();
        const peerId: string = generatePeerId();

        const interval = setInterval(() => {
            if(socket.readyState == WebSocket.OPEN) {
                sendHeartbeat(socket, peerId)
            } else {
                console.warn(`WebSocket is not open. Stopping heartbeat`);
                clearInterval(interval);
            }

        }, 40000)

        socket.onopen = (event) => {
            console.log("Connected to Auth Server");
            setConnected(true);
            toast.success("Connected", {
                description: "You are connected to Auth Server",
            })

            setPeerName(newPeerName);
            console.log("Generated PeerName", newPeerName);

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

        socket.onmessage = (event) => {

            try {
                console.log("Received Message", event.data);
                const data: ServerMessage<Peer[]> = JSON.parse(event.data);

                if (data.type == "peer-list" && Array.isArray(data.payload)) {
                    console.log("Setting peers:", data.payload);
                    setPeers(data.payload);
                }else if (data.type == "heartbeat_ack" && Array.isArray(data.payload)) {
                    console.log("Server acknowledged heartbeat:", data.payload);
                }
            } catch(error) {
                console.error("Error parsing socket message: ", error);
            }

        }


        // Behavior of page for when the socket connection is closed.
        socket.onclose = () => {
            console.log("Disconnected from Auth Server");
            setConnected(false);
            clearInterval(interval);
            console.warn(`Socket closed, stopping heartbeat`);
            toast.info("Disconnected from Auth Server");
        }

        return () => {
            socket.close();
            console.log("Disconnected", {
                description: "The connection to the Auth Server has been disconnected",
            });
        }

    }, [url]);
    return {connected, peerName, peerId, peers};
}