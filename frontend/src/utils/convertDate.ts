function convertDate(date: Date) {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default convertDate;
