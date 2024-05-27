import { SEND_MESSAGE } from "./types";
import { DISMISS_MESSAGE } from "./types";

export const sendMessage = (message: string, type: string) => ({
    type: SEND_MESSAGE,
    payload: { message: message, type: type }
});

export type sendMessageAction = ReturnType<typeof sendMessage>;

export const dismissMessage = () => ({
    type: DISMISS_MESSAGE
});
