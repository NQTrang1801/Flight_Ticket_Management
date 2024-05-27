import { sendMessageAction } from "~/actions/message";
import { SEND_MESSAGE } from "../actions/types";
import { DISMISS_MESSAGE } from "../actions/types";

interface Message {
    message: string;
    type: string;
    showToast: boolean;
}

const initialState: Message = {
    message: "",
    type: "info",
    showToast: false
};

export default function (state = initialState, action: sendMessageAction) {
    switch (action.type) {
        case SEND_MESSAGE:
            return { message: action.payload.message, type: action.payload.type, showToast: true };
        case DISMISS_MESSAGE:
            return {
                ...state,
                message: "",
                type: "",
                showToast: false
            };
        default:
            return state;
    }
}
