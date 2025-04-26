export interface ServerMessage<T = any> {
    type: string;
    source: string;
    destination: string | null;
    payload: T;
}