import axios from "~/utils/axios";
import { useState, useEffect } from "react";
import usePortal from "react-cool-portal";
import IsRequired from "~/icons/IsRequired";
import Tippy from "@tippyjs/react/headless";
import { useAppDispatch } from "~/hook";
import { sendMessage } from "~/actions/message";

const PermissionGiving: React.FC<{ _id: string | undefined }> = ({ _id }) => {
    const [functionalityData, setFunctionalityData] = useState();

    const [collectionCode, setCollectionCode] = useState<number>(-1);
    const [groupAccountCode, setGroupAccountCode] = useState<number>(-1);

    const [selectedFuncs, setSelectedFuncs] = useState([]);

    const collectionNames = [
        "Website",
        "Rule",
        "User",
        "Groups",
        "Permissions",
        "Functionalities",
        "Request reservation",
        "Reservation",
        "Airport",
        "Flight"
    ];

    const [collection, setCollection] = useState("");
    const [collectionVisible, setCollectionVisible] = useState(false);

    const [groupAccount, setGroupAccount] = useState("");
    const [groupAccountVisible, setGroupAccountVisible] = useState(false);

    const { Portal, hide } = usePortal({
        defaultShow: true
    });

    const dispatch = useAppDispatch();

    const givePermission = () => {
        (async () => {
            try {
                await axios.post(
                    "/permission/511454990/create",
                    {
                        group_id: _id,
                        functionality_ids: selectedFuncs
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                        }
                    }
                );

                dispatch(sendMessage("Gave permission successfully!", "success"));
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 1000);
                return () => clearTimeout(timer);
            } catch (error) {
                dispatch(sendMessage(`Gave permission failed! ${error.response.data.message}`, "error"));
                console.error(error);
            }
        })();
    };

    useEffect(() => {
        (async () => {
            await axios
                .get("/functionalities/511320617/all-by-group", {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")!).token}`
                    }
                })
                .then((response) => {
                    setFunctionalityData(response.data);
                })
                .catch((err) => console.error(err));
        })();
    }, []);

    // console.log(functionalityData);

    useEffect(() => {
        setGroupAccount("");
        setGroupAccountCode(-1);
        if (collection !== "") {
            switch (collection) {
                case "Rule":
                    setCollectionCode(340);
                    break;
                case "User":
                    setCollectionCode(447);
                    break;
                case "Groups":
                    setCollectionCode(413);
                    break;
                case "Permissions":
                    setCollectionCode(990);
                    break;
                case "Functionalities":
                    setCollectionCode(617);
                    break;
                case "Request reservation":
                    setCollectionCode(946);
                    break;
                case "Reservation":
                    setCollectionCode(884);
                    break;
                case "Airport":
                    setCollectionCode(675);
                    break;
                case "Flight":
                    setCollectionCode(641);
                    break;
                case "Website":
                    setCollectionCode("000");
                    break;
                default:
                    setCollectionCode(-1);
            }
        }
    }, [collection]);

    // console.log(functionalityData?.[collectionCode]?.[groupAccountCode]);
    // console.log(selectedFuncs);

    return (
        functionalityData && (
            <Portal>
                <div className="fixed top-0 right-0 left-0 bottom-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="border border-blue p-8 bg-background relative rounded-xl max-w-[444px]">
                            <button
                                onClick={hide}
                                className="absolute right-4 top-4 border border-blue rounded-full p-1 hover:border-primary hover:bg-primary"
                            >
                                <i>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width={14}
                                        height={14}
                                        id="close"
                                    >
                                        <path
                                            className="fill-white"
                                            d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
                                        ></path>
                                    </svg>
                                </i>
                            </button>
                            <div className="flex justify-center mb-8">
                                <div className="text-white font-semibold text-xl">Give new permission</div>
                            </div>
                            <div className="flex justify-center flex-col gap-6">
                                <div className="text-blue text-[15px] flex items-center gap-1">
                                    Functionalities
                                    <IsRequired />
                                </div>
                                <div>
                                    <Tippy
                                        visible={collectionVisible}
                                        interactive
                                        onClickOutside={() => setCollectionVisible(false)}
                                        offset={[0, 0]}
                                        placement="bottom"
                                        render={(attrs) => (
                                            <ul
                                                className={`border border-primary rounded-xl p-2 w-[380px] bg-background ${
                                                    collectionVisible
                                                        ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                        : ""
                                                }`}
                                                {...attrs}
                                            >
                                                {collectionNames.map((collectionName) => (
                                                    <li
                                                        onClick={() => {
                                                            setCollection(collectionName);
                                                            setCollectionVisible(false);
                                                        }}
                                                        key={collectionName}
                                                        className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                            collection === collectionName
                                                                ? "text-blue pointer-events-none"
                                                                : ""
                                                        }`}
                                                    >
                                                        Collection: {collectionName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    >
                                        <div
                                            className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[380px] ${
                                                collectionVisible
                                                    ? "rounded-tl-xl rounded-tr-xl border-primary"
                                                    : "rounded-xl"
                                            }   flex justify-between items-center`}
                                            onClick={() => setCollectionVisible(!collectionVisible)}
                                        >
                                            {collection !== "" ? `Collection: ${collection}` : "Choose a collection"}
                                            <i className={`${collectionVisible ? "rotate-180" : ""}`}>
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
                                {collectionCode !== -1 && (
                                    <div>
                                        <Tippy
                                            visible={groupAccountVisible}
                                            interactive
                                            onClickOutside={() => setGroupAccountVisible(false)}
                                            offset={[0, 0]}
                                            placement="bottom"
                                            render={(attrs) => (
                                                <ul
                                                    className={`border border-primary rounded-xl p-2 w-[380px] bg-background ${
                                                        groupAccountVisible
                                                            ? "border-t-0 rounded-tl-none rounded-tr-none"
                                                            : ""
                                                    }`}
                                                    {...attrs}
                                                >
                                                    {Object.entries(functionalityData[collectionCode]).map(
                                                        ([key, val]) => (
                                                            <li
                                                                onClick={() => {
                                                                    let groupAccountVal;
                                                                    switch (key) {
                                                                        case "511":
                                                                            groupAccountVal = "Admin";
                                                                            break;
                                                                        case "999":
                                                                            groupAccountVal = "Administrator";
                                                                            break;
                                                                        default:
                                                                            groupAccountVal = "User";
                                                                    }
                                                                    setGroupAccount(groupAccountVal);
                                                                    setGroupAccountCode(key);
                                                                    setGroupAccountVisible(false);
                                                                }}
                                                                key={key}
                                                                className={`cursor-pointer py-2 px-4 hover:bg-primary text-left rounded-xl flex items-center p-2 ${
                                                                    groupAccount === val
                                                                        ? "text-blue pointer-events-none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {key === "999"
                                                                    ? "Group account: Administrator"
                                                                    : key === "511"
                                                                      ? "Group account: Admin"
                                                                      : "Group account: User"}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        >
                                            <div
                                                className={`hover:border-primary py-3 px-4 border-blue border bg-background cursor-pointer w-[380px] ${
                                                    groupAccountVisible
                                                        ? "rounded-tl-xl rounded-tr-xl border-primary"
                                                        : "rounded-xl"
                                                }   flex justify-between items-center`}
                                                onClick={() => setGroupAccountVisible(!groupAccountVisible)}
                                            >
                                                {groupAccount
                                                    ? `Group account: ${groupAccount}`
                                                    : "Choose a group account"}
                                                <i className={`${groupAccountVisible ? "rotate-180" : ""}`}>
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
                                )}
                                {functionalityData?.[collectionCode]?.[groupAccountCode] && (
                                    <div className="text-blue">Click on permission below to select.</div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    {functionalityData?.[collectionCode]?.[groupAccountCode] &&
                                        functionalityData?.[collectionCode]?.[groupAccountCode].map((functionality) => (
                                            <div
                                                onClick={() => {
                                                    if (selectedFuncs.includes(functionality._id)) {
                                                        const newArr = selectedFuncs.filter(
                                                            (selectedFunctionality) =>
                                                                selectedFunctionality !== functionality._id
                                                        );
                                                        setSelectedFuncs(newArr);
                                                    } else {
                                                        setSelectedFuncs([...selectedFuncs, functionality._id]);
                                                    }
                                                }}
                                                key={functionality._id}
                                                className={`text-[13px] capitalize border border-blue rounded-xl p-2 w-full text-center hover:bg-primary hover:border-primary cursor-pointer ${
                                                    selectedFuncs.includes(functionality._id) &&
                                                    "bg-primary border-primary"
                                                }`}
                                            >
                                                {functionality.functionalityName.toLowerCase()}
                                            </div>
                                        ))}
                                </div>
                                <div className="outline outline-1 outline-border w-full"></div>
                                <button
                                    className="py-3 px-8 text-base font-semibold rounded-xl border-blue border hover:border-primary hover:bg-primary"
                                    onClick={givePermission}
                                >
                                    Give permission
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        )
    );
};

export default PermissionGiving;
