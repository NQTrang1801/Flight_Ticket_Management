function shortenAirportName(airportName: string): string {
    // Define patterns to be removed
    const patternsToRemove = [/ International Airport$/, / Airport$/, / international airport$/, / airport$/];

    let shortenedName = airportName;

    // Remove the patterns from the airport name
    for (const pattern of patternsToRemove) {
        shortenedName = shortenedName.replace(pattern, "");
    }

    return shortenedName;
}

export default shortenAirportName;
