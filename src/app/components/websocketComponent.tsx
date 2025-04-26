'use client'
import {useWebSocket} from "@/app/hooks/useWebSocket";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function WebSocketComponent() {
    const { connected, peerName, peerId, peers } = useWebSocket("ws://localhost:8080/ws");

    const filteredPeers = peers.filter((peer) => peer.peerId !== peerId);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">WebSocket Demo</h1>

            <div className="max-w-md mx-auto relative">
                {Array.isArray(peers) && filteredPeers.length > 0 ? (
                    <Carousel>
                        <CarouselNext/>
                        <CarouselContent>
                            {filteredPeers.map((peer) => (
                                    <CarouselItem key={peer.peerId} className="flex items-center justify-center h-40 rounded-md bg-zinc-800 text-3xl font-bold text-white">
                                        {peer.displayName}
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                        <CarouselPrevious/>
                    </Carousel>
                ) : (
                    <div className="p-6 bg-zinc-800 rounded-md text-center text-white">
                        <h2 className="text-lg font-semibold mb-2">No peers online</h2>
                        <p className="text-sm">Waiting for others to join...</p>
                    </div>
                )}

            </div>

        </div>
    )
}
