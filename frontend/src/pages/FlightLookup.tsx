import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import formatDateTime from "~/utils/formatDateTime";
import Tippy from "@tippyjs/react/headless";
import shortenAirportName from "~/utils/shortenAirportName";

function FlightLookup() {
    const [flightData, setFlightData] = useState<FlightScheduleData[]>();
    const [airportData, setAirportData] = useState<AirportData[]>();

    const [departureAirport, setDepartureAirport] = useState<{
        address: string;
        code: string;
        country: string;
        name: string;
        _id: string;
    }>({ address: "", code: "", country: "", name: "", _id: "" });
    const [arrivalAirport, setArrivalAirport] = useState("All");
    const [departureAirportVisible, setDepartureAirportVisible] = useState(false);
    const [arrivalAirportVisible, setArrivalAirportVisible] = useState(false);

    useEffect(() => {
        (async () => {
            await axios
                .get("/flight/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setFlightData(response.data);
                })
                .catch((err) => console.error(err));
        })();
        (async () => {
            await axios
                .get("/airport/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setAirportData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="flex gap-4">
                <div>
                    <Tippy
                        visible={departureAirportVisible}
                        interactive
                        onClickOutside={() => setDepartureAirportVisible(false)}
                        offset={[0, 0]}
                        placement="bottom"
                        render={(attrs) => (
                            <ul
                                className={`border border-primary rounded-xl p-2 w-[250px] bg-background ${
                                    departureAirportVisible ? "border-t-0 rounded-tl-none rounded-tr-none" : ""
                                }`}
                                {...attrs}
                            >
                                {airportData?.map((airport) => (
                                    <li
                                        onClick={() => {
                                            setDepartureAirport(airport);
                                            setDepartureAirportVisible(false);
                                        }}
                                        key={airport._id}
                                        className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                            departureAirport?._id === airport._id ? "text-blue pointer-events-none" : ""
                                        }`}
                                    >
                                        {shortenAirportName(airport.name)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    >
                        <div
                            className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[250px] ${
                                departureAirportVisible ? "rounded-tl-xl rounded-tr-xl border-primary" : "rounded-xl"
                            }   flex justify-between items-center`}
                            onClick={() => setDepartureAirportVisible(!departureAirportVisible)}
                        >
                            Departure: {departureAirport ? shortenAirportName(departureAirport.name) : "All"}
                            <i className={`${departureAirportVisible ? "rotate-180" : ""}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    id="chevron-down"
                                >
                                    <path
                                        fill="#fff"
                                        d="M4.14645,5.64645 C4.34171,5.45118 4.65829,5.45118 4.85355,5.64645 L7.9999975,8.79289 L11.1464,5.64645 C11.3417,5.45118 11.6583,5.45118 11.8536,5.64645 C12.0488,5.84171 12.0488,6.15829 11.8536,6.35355 L8.35355,9.85355 C8.15829,10.0488 7.84171,10.0488 7.64645,9.85355 L4.14645,6.35355 C3.95118,6.15829 3.95118,5.84171 4.14645,5.64645 Z"
                                    ></path>
                                </svg>
                            </i>
                        </div>
                    </Tippy>
                </div>
            </div>
            <div className="bg-block p-6 rounded-3xl shadow-xl mt-4">
                <div className="flex gap-6 flex-col">
                    <table className="w-full bg-block">
                        <thead>
                            <tr className="text-center bg-primary">
                                <th className="">Index</th>
                                <th className="">Flight number</th>
                                <th className="">Departure airport</th>
                                <th className="">Arrival airport</th>
                                <th className="">Departure datetime</th>
                                <th className="">Flight duration</th>
                                <th className="">Available seats</th>
                                <th className="">Booked seats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flightData && flightData.length > 0
                                ? flightData
                                      .filter((flight) => {
                                          if (departureAirport._id !== "")
                                              return flight.departure_airport._id === departureAirport?._id;
                                          return flight;
                                      })
                                      .map((flight, index) => (
                                          <tr key={flight._id} className="text-center">
                                              <td>{index + 1}</td>
                                              <td>{flight.flight_number}</td>
                                              <td>{shortenAirportName(flight.departure_airport.name)}</td>
                                              <td>{shortenAirportName(flight.destination_airport.name)}</td>
                                              <td>{formatDateTime(flight.departure_datetime)}</td>
                                              <td>{flight.duration} min</td>
                                              <td>
                                                  {flight.seats[0].count +
                                                      flight.seats[1].count -
                                                      flight.seats[0].booked_seats -
                                                      flight.seats[1].booked_seats}
                                              </td>
                                              <td>{flight.seats[0].booked_seats + flight.seats[1].booked_seats}</td>
                                          </tr>
                                      ))
                                : ""}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default FlightLookup;
