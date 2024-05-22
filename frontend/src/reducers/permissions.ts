import { UpdatePermissionsAction } from "~/actions/permissions";
import { UPDATE_PERMISSIONS } from "~/actions/types";

const initialState = {
    permissions: []
};

export default function (state = initialState, action: UpdatePermissionsAction) {
    switch (action.type) {
        case UPDATE_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload
            };
        default:
            return state;
    }
}
