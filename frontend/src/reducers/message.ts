import { sendMessageAction } from "~/actions/message";
import { SEND_MESSAGE } from "../actions/types";

interface Message {
    message: string;
}

const initialState: Message = {
    message: ""
};

export default function (state = initialState, action: sendMessageAction) {
    switch (action.type) {
        case SEND_MESSAGE:
            return { message: action.payload };
        default:
            return state;
    }
}
