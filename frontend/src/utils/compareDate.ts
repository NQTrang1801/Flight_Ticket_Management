export default function compareDate(dateString: string): boolean {
    const currentDate = new Date();
    const specifiedDate = new Date(dateString);
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    return currentDateOnly < specifiedDate;
}
