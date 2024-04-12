const getNumsOfCol = (seats: Array<{ seatRow: string; seatColumn: string }>) => {
    const seatRow = seats[0].seatRow;
    let numsOfCol = 1;
    while (true) {
        if (seatRow !== seats[numsOfCol].seatRow) break;
        else numsOfCol++;
    }
    return numsOfCol;
};

export default getNumsOfCol;
