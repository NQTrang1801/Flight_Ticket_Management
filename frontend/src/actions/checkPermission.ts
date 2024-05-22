import { CHECK_PERMISSION } from "./types";

export const checkPermission = (functionalityCode: string) => ({
    type: CHECK_PERMISSION,
    payload: functionalityCode
});

export type CheckPermissionAction = ReturnType<typeof checkPermission>;
