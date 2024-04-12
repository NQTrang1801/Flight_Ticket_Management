import { SEND_MESSAGE } from "./types";

export const sendMessage = (message: string) => ({
    type: SEND_MESSAGE,
    payload: message
});

export type sendMessageAction = ReturnType<typeof sendMessage>;
