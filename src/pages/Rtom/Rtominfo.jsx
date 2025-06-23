import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import edit_info from "../../assets/images/edit-info.svg";
import { fetchRTOMDetails } from "../../services/RTOM/RtomService";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    listener();
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

const RtomInfo = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [negotiation, setNegotiation] = useState("");
    const [endDate, setEndDate] = useState("");
    const [remark, setRemark] = useState("");
    const [isEndButtonVisible, setIsEndButtonVisible] = useState(true);
    const [rtomDetails, setRtomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
     const [logHistory, setLogHistory] = useState([]);

const location = useLocation();

  const rtomId = location.state?.rtomId;

    

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isSmallMobile = useMediaQuery("(max-width: 480px)");
    const rowsPerPage = 7;

    const goBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        const loadRTOMDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetchRTOMDetails(rtomId);
                setRtomDetails(response);
                setLogHistory(response.rtom_remarks || []);
            } catch (error) {
                Swal.fire("Error", error.message || "Failed to load RTOM details", "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (rtomId) {
            loadRTOMDetails();
        }
    }, [rtomId]);

    const filteredLogHistory = logHistory.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const pages = Math.ceil(filteredLogHistory.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedLogHistory = filteredLogHistory.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
    };

    const handleSaveClick = () => {
        if (negotiation && (!endDate || !remark)) {
            alert("Please provide the end date and remarks.");
            return;
        }
        alert("Form submitted successfully!");
        console.log("Data saved:", {
            endDate: negotiation ? endDate : null,
            remark,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!rtomDetails) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">No RTOM details found for ID: {rtomId}</p>
            </div>
        );
    }

    return (
        <div className={GlobalStyle.fontPoppins} style={{ fontSize: isSmallMobile ? "14px" : "16px" }}>
            <div className={`${GlobalStyle.headingLarge} mb-8`} style={{ textAlign: isMobile ? "center" : "left" }}>
                <span>{rtomDetails.billing_center_code} - {rtomDetails.rtom_name} RTOM Area</span>
            </div>

            <div className="flex justify-center">
                <div 
                    className={`${GlobalStyle.cardContainer} p-4`}
                    style={{
                        width: isMobile ? "95%" : "80%",
                        padding: isMobile ? "1rem" : "2rem"
                    }}
                >
                    <div className="flex mb-4 justify-end">
                        <Link to={`/pages/Rtom/RtomInfoEdit/${rtomId}`}>
                            <button>
                                <img src={edit_info} title="Edit" className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>

                    <table className="mb-8 w-full">
                        <tbody>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
                                        Added Date
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                   <label>
                                    {rtomDetails.created_on ? new Date(rtomDetails.created_on).toLocaleDateString('en-US') : "N/A"}
                                    </label>

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
                                        Billing Center Code
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.billing_center_code}</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
                                        RTOM Name
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.rtom_name}</label>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
                                        Area Code
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.area_code}</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 `}>
                                        Email
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>{rtomDetails.rtom_email || "N/A"}</label>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="py-2"></td>
                            </tr>

                            <tr>
                             <td colSpan="3">
                                <label className={`${GlobalStyle.headingMedium} border-b-2 border-black font-bold inline-block ml-10`}>
                                    Contact Details
                                </label>
                            </td>

                            </tr>

                            <tr>
                                <td colSpan="3" className="py-2"></td>
                            </tr>
                        

                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
                                        Mobile
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>
                                        {rtomDetails.rtom_mobile_no || "N/A"}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={`${GlobalStyle.headingMedium} pl-16 `}>
                                        Telephone
                                    </label>
                                </td>
                                <td> : </td>
                                <td>
                                    <label>
                                        {rtomDetails.rtom_telephone_no || "N/A"}
                                    </label>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col">
                {isEndButtonVisible && (
                    <div className="flex justify-end mb-4" style={{ padding: isMobile ? "0 1rem" : "0" }}>
                        <Link to={`/pages/Rtom/RtomInfoEnd/${rtomId}`}>
                            <button
                                className={GlobalStyle.buttonPrimary}
                                style={{
                                    padding: isSmallMobile ? "0.5rem 1rem" : "0.75rem 1.5rem"
                                }}
                                onClick={() => {
                                    setNegotiation("end");
                                    setIsEndButtonVisible(false);
                                }}
                            >
                                End
                            </button>
                        </Link>
                    </div>
                )}

                {negotiation && (
                    <div>
                        <div 
                            className="flex gap-4 items-center mb-6"
                            style={{
                                flexDirection: isMobile ? "column" : "row",
                                justifyContent: isMobile ? "flex-start" : "center",
                                padding: isMobile ? "0 1rem" : "0"
                            }}
                        >
                            <label className="block font-medium mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={GlobalStyle.inputText}
                                style={{
                                    width: isMobile ? "100%" : "auto"
                                }}
                            />
                        </div>
                        <div 
                            className="flex mb-6 gap-4"
                            style={{
                                flexDirection: isMobile ? "column" : "row",
                                justifyContent: isMobile ? "flex-start" : "center",
                                padding: isMobile ? "0 1rem" : "0"
                            }}
                        >
                            <label className={GlobalStyle.remarkTopic}>Remark</label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className={GlobalStyle.remark}
                                style={{
                                    width: isMobile ? "100%" : "auto"
                                }}
                                rows="5"
                            ></textarea>
                        </div>

                        <div className="flex justify-end w-full mt-6" style={{ padding: isMobile ? "0 1rem" : "0" }}>
                            <button 
                                className={GlobalStyle.buttonPrimary}
                                style={{
                                    padding: isSmallMobile ? "0.5rem 1rem" : "0.75rem 1.5rem"
                                }}
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}

                <div 
                    className="flex flex-col items-start"
                    style={{
                        marginTop: isMobile ? "1rem" : "-3.5rem",
                        padding: isMobile ? "0 1rem" : "0"
                    }}
                >
                    <button
                        className={GlobalStyle.buttonPrimary}
                        style={{
                            padding: isSmallMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
                            marginBottom: "1rem"
                        }}
                        onClick={() => setShowPopup(true)}
                    >
                        Log History
                    </button>

                    <div style={{ marginTop: '12px' }}>
                        <button 
                            className={GlobalStyle.navButton} 
                            onClick={goBack}
                            style={{ padding: isSmallMobile ? "0.5rem" : "0.75rem 1rem" }}
                        >
                            <FaArrowLeft /> Back
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div 
                        className="bg-white rounded-md shadow-lg"
                        style={{
                            width: isMobile ? "95%" : "80%",
                            maxHeight: "80vh",
                            padding: isMobile ? "1rem" : "2rem",
                            overflow: "auto"
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Log History</h2>
                            <button
                                className="text-red-500 text-lg font-bold"
                                onClick={() => setShowPopup(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div>
                            <div className="mb-4 flex justify-start">
                                <div className={GlobalStyle.searchBarContainer}>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={GlobalStyle.inputSearch}
                                    />
                                    <FaSearch className={GlobalStyle.searchBarIcon} />
                                </div>
                            </div>
                            <div className={GlobalStyle.tableContainer}>
                                <table className={GlobalStyle.table}>
                                    <thead className={GlobalStyle.thead}>
                                        <tr>
                                            <th className={GlobalStyle.tableHeader}>Edited On</th>
                                            <th className={GlobalStyle.tableHeader}>Action</th>
                                            <th className={GlobalStyle.tableHeader}>Edited By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLogHistory.length > 0 ? (
                                            paginatedLogHistory.map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${index % 2 === 0
                                                            ? "bg-white bg-opacity-75"
                                                            : "bg-gray-50 bg-opacity-50"
                                                        } border-b`}
                                                >
                                                    <td className={GlobalStyle.tableData}>
                                                        {row.remark_date ? new Date(row.remark_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit'
                                                        }) : "N/A"}
                                                    </td>
                                                    <td className={GlobalStyle.tableData}>{row.remark}</td>
                                                    <td className={GlobalStyle.tableData}>{row.remark_by}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4">
                                                    No log history found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredLogHistory.length > rowsPerPage && (
                                <div className={GlobalStyle.navButtonContainer}>
                                    <button
                                        className={GlobalStyle.navButton}
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 0}
                                    >
                                        <FaArrowLeft />
                                    </button>
                                    <span>
                                        Page {currentPage + 1} of {pages}
                                    </span>
                                    <button
                                        className={GlobalStyle.navButton}
                                        onClick={handleNextPage}
                                        disabled={currentPage === pages - 1}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RtomInfo;







// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import edit_info from "../../assets/images/edit-info.svg";
// import { fetchRTOMDetails } from "../../services/RTOM/RtomService";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";


// const RtomInfo = () => {
//     const { rtomId } = useParams();
//     const [showPopup, setShowPopup] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(0);
//     const [negotiation, setNegotiation] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [remark, setRemark] = useState("");
//     const [isEndButtonVisible, setIsEndButtonVisible] = useState(true);
//     const [rtomDetails, setRtomDetails] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();
//     const [logHistory, setLogHistory] = useState([]);

//     const rowsPerPage = 7;
//      const goBack = () => {
//         navigate(-1); 
//         };


//    useEffect(() => {
//         const loadRTOMDetails = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await fetchRTOMDetails(rtomId);
//                 setRtomDetails(response);
//                 setLogHistory(response.rtom_remarks || []);
//             } catch (error) {
//                 Swal.fire("Error", error.message || "Failed to load RTOM details", "error");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (rtomId) {
//             loadRTOMDetails();
//         }
//     }, [rtomId]);

//     const filteredLogHistory = logHistory.filter((row) =>
//         Object.values(row)
//             .join(" ")
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//     );

//     const pages = Math.ceil(filteredLogHistory.length / rowsPerPage);
//     const startIndex = currentPage * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const paginatedLogHistory = filteredLogHistory.slice(startIndex, endIndex);

//     const handlePrevPage = () => {
//         if (currentPage > 0) setCurrentPage(currentPage - 1);
//     };

//     const handleNextPage = () => {
//         if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
//     };

//     const handleSaveClick = () => {
//         if (negotiation && (!endDate || !remark)) {
//             alert("Please provide the end date and remarks.");
//             return;
//         }
//         alert("Form submitted successfully!");
//         console.log("Data saved:", {
//             endDate: negotiation ? endDate : null,
//             remark,
//         });
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (!rtomDetails) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <p className="text-red-500">No RTOM details found for ID: {rtomId}</p>
//             </div>
//         );
//     }

//     return (
//         <div className={GlobalStyle.fontPoppins}>
//             <div className={`${GlobalStyle.headingLarge} mb-8`}>
//                 <span>{rtomDetails. billing_center_code} - {rtomDetails.rtom_name} RTOM Area </span>
//             </div>

//             <div className="flex justify-center">
//                 <div className={`${GlobalStyle.cardContainer} p-4`}>
//                     <div className="flex mb-4 justify-end">
//                         <Link to={`/pages/Rtom/RtomInfoEdit/${rtomId}`}>
//                             <button>
//                                 <img src={edit_info} title="Edit" className="w-6 h-6" />
//                             </button>
//                         </Link>
//                     </div>

//                     <table className="mb-8 w-full">
//                         <tbody>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block`}>
//                                         Added Date
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                    <label>
//                                     {rtomDetails.created_on ? new Date(rtomDetails.created_on).toLocaleDateString('en-US') : "N/A"}
//                                     </label>

//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
//                                         Billing Center Code
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>{rtomDetails.billing_center_code}</label>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
//                                         RTOM Name
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>{rtomDetails.rtom_name}</label>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
//                                         Area Code
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>{rtomDetails.area_code}</label>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 `}>
//                                         Email
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>{rtomDetails.rtom_email || "N/A"}</label>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                             </tr>

//                             <tr>
//                                 <td colSpan="3" className="py-2"></td>
//                             </tr>

//                             <tr>
//                              <td colSpan="3">
//                                 <label className={`${GlobalStyle.headingMedium} border-b-2 border-black font-bold inline-block ml-10`}>
//                                     Contact Details
//                                 </label>
//                             </td>

//                             </tr>

//                             <tr>
//                                 <td colSpan="3" className="py-2"></td>
//                             </tr>
                        

//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 mb-2 block `}>
//                                         Mobile
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>
//                                         {rtomDetails.rtom_mobile_no || "N/A"}
//                                     </label>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <label className={`${GlobalStyle.headingMedium} pl-16 `}>
//                                         Telephone
//                                     </label>
//                                 </td>
//                                 <td> : </td>
//                                 <td>
//                                     <label>
//                                         {rtomDetails.rtom_telephone_no || "N/A"}
//                                     </label>
//                                 </td>
//                             </tr>
                            
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <div className="flex flex-col">
//                 {isEndButtonVisible && (
//                     <div className="flex justify-end mb-4">
//                         <Link to={`/pages/Rtom/RtomInfoEnd/${rtomId}`}>
//                             <button
//                                 className={`${GlobalStyle.buttonPrimary}`}
//                                 onClick={() => {
//                                     setNegotiation("end");
//                                     setIsEndButtonVisible(false);
//                                 }}
//                             >
//                                 End
//                             </button>
//                         </Link>
//                     </div>
//                 )}

//                 {negotiation && (
//                     <div>
//                         <div className="flex gap-4 items-center mb-6 justify-center">
//                             <label className="block font-medium mb-2">End Date</label>
//                             <input
//                                 type="date"
//                                 value={endDate}
//                                 onChange={(e) => setEndDate(e.target.value)}
//                                 className={GlobalStyle.inputText}
//                             />
//                         </div>
//                         <div className="flex mb-6 justify-center gap-4">
//                             <label className={GlobalStyle.remarkTopic}>Remark</label>
//                             <textarea
//                                 value={remark}
//                                 onChange={(e) => setRemark(e.target.value)}
//                                 className={`${GlobalStyle.remark}`}
//                                 rows="5"
//                             ></textarea>
//                         </div>

//                         <div className="flex justify-end w-full mt-6">
//                             <button className={GlobalStyle.buttonPrimary} onClick={handleSaveClick}>
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex flex-col items-start -mt-14">
//                     <button
//                         className={`${GlobalStyle.buttonPrimary}`}
//                         onClick={() => setShowPopup(true)}
//                     >
//                         Log History
//                     </button>

//                     <div style={{ marginTop: '12px' }}>
//                         <button className={GlobalStyle.navButton} onClick={goBack}>
//                         <FaArrowLeft />  Back
//                         </button>
//                     </div>
//                 </div>

//             </div>

//             {showPopup && (
//                 <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-bold">Log History</h2>
//                             <button
//                                 className="text-red-500 text-lg font-bold"
//                                 onClick={() => setShowPopup(false)}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div>
//                             <div className="mb-4 flex justify-start">
//                                 <div className={GlobalStyle.searchBarContainer}>
//                                     <input
//                                         type="text"
//                                         placeholder=""
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         className={GlobalStyle.inputSearch}
//                                     />
//                                     <FaSearch className={GlobalStyle.searchBarIcon} />
//                                 </div>
//                             </div>
//                             <div className={GlobalStyle.tableContainer}>
//                                 <table className={GlobalStyle.table}>
//                                     <thead className={GlobalStyle.thead}>
//                                         <tr>
//                                             <th className={GlobalStyle.tableHeader}>Edited On</th>
//                                             <th className={GlobalStyle.tableHeader}>Action</th>
//                                             <th className={GlobalStyle.tableHeader}>Edited By</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {paginatedLogHistory.length > 0 ? (
//                                             paginatedLogHistory.map((row, index) => (
//                                                 <tr
//                                                     key={index}
//                                                     className={`${index % 2 === 0
//                                                             ? "bg-white bg-opacity-75"
//                                                             : "bg-gray-50 bg-opacity-50"
//                                                         } border-b`}
//                                                 >
//                                                  <td className={GlobalStyle.tableData}>
//                                                         {row.remark_date ? new Date(row.remark_date).toLocaleDateString('en-US', {
//                                                             year: 'numeric',
//                                                             month: '2-digit',
//                                                             day: '2-digit'
//                                                         }) : "N/A"}
//                                                     </td>
//                                                     <td className={GlobalStyle.tableData}>{row.remark}</td>
//                                                     <td className={GlobalStyle.tableData}>{row.remark_by}</td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="4" className="text-center py-4">
//                                                     No log history found
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             {filteredLogHistory.length > rowsPerPage && (
//                                 <div className={GlobalStyle.navButtonContainer}>
//                                     <button
//                                         className={GlobalStyle.navButton}
//                                         onClick={handlePrevPage}
//                                         disabled={currentPage === 0}
//                                     >
//                                         <FaArrowLeft />
//                                     </button>
//                                     <span>
//                                         Page {currentPage + 1} of {pages}
//                                     </span>
//                                     <button
//                                         className={GlobalStyle.navButton}
//                                         onClick={handleNextPage}
//                                         disabled={currentPage === pages - 1}
//                                     >
//                                         <FaArrowRight />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RtomInfo;




