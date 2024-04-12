export const convertNormalDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
};
