import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import { useAppSelector } from "~/hook";

function UserAirports() {
    const [data, setData] = useState<AirportData[]>();

    const { query } = useAppSelector((state) => state.searching!);

    useEffect(() => {
        (async () => {
            await axios
                .get("/airport/all", { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    return (
        <>
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                    {data &&
                        data
                            ?.filter((airport) => airport.name.toLowerCase().includes(query.toLowerCase()))
                            .map((airport) => (
                                <div
                                    key={airport._id}
                                    className="p-6 rounded-xl overflow-hidden shadow-xl border border-primary bg-background relative"
                                >
                                    <div
                                        className={`${
                                            airport.isInternational ? "bg-primary" : "bg-blue"
                                        } absolute top-0 left-0 right-0 p-2 text-center font-semibold text-base`}
                                    >
                                        {airport.name}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <div>
                                            <span className="font-semibold">Code</span>: {airport.code}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Country</span>: {airport.country}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Address</span>: {airport.address}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Time zone</span>: {airport.timezone}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Terminals</span>: {airport.terminals}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Capacity</span>: {airport.capacity}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Coordinates</span>:{" "}
                                            {airport.coordinates.coordinates.join(", ")}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Status</span>:{" "}
                                            {airport.status === false ? "False" : "True"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </>
    );
}

export default UserAirports;
