import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface LoaderPortalProps {
    children: ReactNode;
}

const LoaderPortal = ({ children }: LoaderPortalProps) => {
    const loaderRoot = document.getElementById("loader-root");

    if (!loaderRoot) return null;

    return ReactDOM.createPortal(children, loaderRoot);
};

export default LoaderPortal;
