import { SearchAction } from "~/actions/searching";
import { SEARCH } from "~/actions/types";

interface Search {
    query: string;
}

const initialState: Search = {
    query: ""
};

export default function (state = initialState, action: SearchAction) {
    switch (action.type) {
        case SEARCH:
            return { query: action.payload };
        default:
            return state;
    }
}
