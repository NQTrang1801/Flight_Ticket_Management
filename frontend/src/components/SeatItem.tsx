import React from "react";

interface Props {
    numberOfRow: string;
    numberOfColumn: string;
    id: string;
}

const SeatItem: React.FC<Props> = ({ numberOfColumn, numberOfRow }) => {
    return (
        <div className="text-center">
            <div>
                {numberOfRow}
                {numberOfColumn}
            </div>
        </div>
    );
};

export default SeatItem;
