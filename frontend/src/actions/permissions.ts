import { UPDATE_PERMISSIONS } from "./types";

interface PermissionsData {
    functionalityCode: string;
    functionalityName: string;
    screenNameToLoad: string;
    _id: string;
}

export const updatePermissions = (permissions: PermissionsData) => ({
    type: UPDATE_PERMISSIONS,
    payload: permissions
});

export type UpdatePermissionsAction = ReturnType<typeof updatePermissions>;
