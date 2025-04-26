import WebSocketComponent from "@/app/components/websocketComponent";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div>
      <WebSocketComponent/>
        <Toaster richColors position="bottom-right" />
    </div>
  );
}
