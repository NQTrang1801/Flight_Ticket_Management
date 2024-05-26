const checkPermission = (
    permissions: {
        functionalityCode: string;
        functionalityName: string;
        screenNameToLoad: string;
        _id: string;
    }[],
    functionalityCode: string
) => {
    return permissions.some((permission) => permission.functionalityCode === functionalityCode);
};

export default checkPermission;
