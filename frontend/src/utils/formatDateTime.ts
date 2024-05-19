function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    // Get date components
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Get time components
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date and time as "dd-mm-yyyy hh:mm"
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedTime} ${formattedDate}`;
}

export default formatDateTime;
