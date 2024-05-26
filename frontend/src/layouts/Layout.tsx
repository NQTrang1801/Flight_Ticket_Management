import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HashLoader from "react-spinners/HashLoader";
import { useAppSelector } from "~/hook";
import LoaderPortal from "~/components/common/LoaderPortal";

function Layout() {
    const { isLoading } = useAppSelector((state) => state.loading!);
    return (
        <>
            <div className="flex flex-row">
                <Header />
                <Sidebar />
                <div className="bg-background w-full pl-[240px] pt-[74px] min-h-[100vh]">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
            <LoaderPortal>
                {isLoading && (
                    <HashLoader
                        loading={isLoading}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        className="!fixed top-[50%] left-[50%] z-[60] mt-[-75px] ml-[-75px]"
                        color="#1883ba"
                    />
                )}
            </LoaderPortal>
            <div id="react-cool-portal"></div>
        </>
    );
}

export default Layout;
