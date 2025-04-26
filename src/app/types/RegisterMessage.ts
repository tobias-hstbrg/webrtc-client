import type { RegisterMessagePayload } from "./RegisterMessagePayload";

export type RegisterMessage = {
    type: "register";
    source: string;
    payload: RegisterMessagePayload;
}