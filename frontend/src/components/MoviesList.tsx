import { useState, useEffect } from "react";
import axios from "~/utils/axios";
import MovieItem from "~/components/MovieItem";
import React from "react";
import SkeletonItem from "./SkeletonItem";
import ToolTip from "@tippyjs/react";
import { useAppSelector } from "~/hook";

interface Props {
    type: string;
    deletingMode: boolean;
    reloadFlag: boolean;
    categoryId: string;
}

const MoviesList: React.FC<Props> = ({ type, deletingMode, reloadFlag, categoryId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { query } = useAppSelector((state) => state.searching!);

    useEffect(() => {
        setLoading(true);
        (async () => {
            await axios
                .get(
                    `/movies?page=1&take=20${
                        categoryId !== "" ? `&categoryId=${categoryId}` : ""
                    }&filterMovies=${type}`,
                    { headers: { "Content-Type": "application/json" } }
                )
                .then((response) => {
                    setData(response.data.data);
                    setLoading(false);
                })
                .catch((error) => console.error(error));
        })();
    }, [type, reloadFlag, categoryId]);

    return (
        <div className="mb-10">
            <div className="bg-block p-6 rounded-3xl shadow-xl">
                <ul className="w-full flex flex-wrap gap-6">
                    {loading && <SkeletonItem />}
                    {!loading &&
                        (data.length > 0 ? (
                            data
                                .filter((movie) => movie.name.toLowerCase().includes(query.toLowerCase()))
                                .map((movie: Movie) => (
                                    <MovieItem
                                        id={movie.id}
                                        key={movie.id}
                                        name={movie.name}
                                        director={movie.director}
                                        img={movie.moviePosters.filter((poster) => poster.isThumb === true)[0].link}
                                        deletingMode={deletingMode}
                                    />
                                ))
                        ) : (
                            <li className="w-[calc((100%-96px)/5)] shadow-sm border border-blue aspect-square rounded-xl flex items-center justify-center group hover:border-primary">
                                <ToolTip content="Create a new movie">
                                    <button className="">
                                        <i>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="add"
                                                x="0"
                                                y="0"
                                                width={92}
                                                height={92}
                                                version="1.1"
                                                viewBox="0 0 29 29"
                                                xmlSpace="preserve"
                                            >
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M14.5 27.071c-6.893 0-12.5-5.607-12.5-12.5s5.607-12.5 12.5-12.5S27 7.678 27 14.571s-5.607 12.5-12.5 12.5zm0-23c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5S25 20.36 25 14.571s-4.71-10.5-10.5-10.5z"
                                                ></path>
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M14.5 21.571a1 1 0 0 1-1-1v-12a1 1 0 0 1 2 0v12a1 1 0 0 1-1 1z"
                                                ></path>
                                                <path
                                                    className="fill-blue group-hover:fill-primary"
                                                    d="M20.5 15.571h-12a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"
                                                ></path>
                                            </svg>
                                        </i>
                                    </button>
                                </ToolTip>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default MoviesList;
