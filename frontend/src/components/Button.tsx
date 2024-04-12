import React from "react";

interface Props {
    fill?: boolean;
    children?: React.ReactNode;
    fontSize?: string;
    onClick?: () => void;
}

const Button: React.FC<Props> = ({ fill = true, children, onClick, fontSize = "sm" }) => {
    return fill ? (
        <button className="bg-primary px-3 py-2" onClick={onClick}>
            {children}
        </button>
    ) : (
        <button
            className={`border-solid border-[1px] hover:border-active hover:text-active border-border px-3 py-2 rounded-lg text-normal text-${fontSize}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
