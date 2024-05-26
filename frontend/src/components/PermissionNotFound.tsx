function PermissionNotFound() {
    return (
        <div className="flex items-center justify-center flex-col gap-6 h-[calc(100vh-74px-12rem)]">
            <i>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="128"
                    height="128"
                    viewBox="0 0 24 24"
                    id="not-interested"
                >
                    <path
                        className="fill-white"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                    ></path>
                </svg>
            </i>
            <div className="text-semibold text-lg">You don't have permission to access this page.</div>
        </div>
    );
}

export default PermissionNotFound;
