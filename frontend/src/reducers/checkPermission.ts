import { CHECK_PERMISSION } from "~/actions/types";
import { CheckPermissionAction } from "~/actions/checkPermission";

const initialState = {
    permissions: []
};

export default function (state = initialState, action: CheckPermissionAction) {
    switch (action.type) {
        case CHECK_PERMISSION:
            const isPermissionGranted = state.permissions.some(
                (permission) => permission.functionalityCode === action.payload
            );
            return {
                ...state,
                isPermissionGranted: isPermissionGranted
            };
        default:
            return state;
    }
}
