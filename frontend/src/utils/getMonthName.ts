function getMonthName(monthNumber: number): string {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Month number must be between 1 and 12");
    }

    return monthNames[monthNumber - 1];
}
export default getMonthName;
