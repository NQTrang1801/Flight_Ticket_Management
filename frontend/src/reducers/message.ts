import { sendMessageAction } from "~/actions/message";
import { SEND_MESSAGE } from "../actions/types";

interface Message {
    message: string;
    type: string;
}

const initialState: Message = {
    message: "",
    type: "info"
};

export default function (state = initialState, action: sendMessageAction) {
    switch (action.type) {
        case SEND_MESSAGE:
            return { message: action.payload.message, type: action.payload.type };
        default:
            return state;
    }
}
