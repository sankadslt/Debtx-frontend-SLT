import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Imprting GlobalStyle
// import { fetchBehaviorsOfCaseDuringDRC } from "../../services/case/CaseService.js";
// import { getUserData } from "../../services/auth/authService.js";

export default function MediationBoardResponse() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Customer Negotiation"); // Active tab

    const {case_id} =useParams();

    const [user, setUser] =useState(null);
    // const [drcId, setDrcId] =useState(null);
    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] =useState([]);
    const[cusNegotiationData, setCusNegotiationData] =useState([]);

    // Tab click handler
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

     //Accordion handler
     const handleAccordion = (index) => {
        setIsOpen(isOpen === index ? null : index);
    }

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userData = await getUserData();
            setUser(userData);
            console.log("DRC ID: ", user?.drc_id);          
          } catch (err) {
            setError(err.message);
          } 
        };
    
        fetchUserData();

    }, []);

    useEffect(() => {
        if (!user?.drc_id) {
          console.log("Missing DRC Id.");
          return;
        }
      
        const fetchData = async () => {
          try {
            
            const data = await fetchBehaviorsOfCaseDuringDRC({ drc_id: user?.drc_id, case_id });   
            console.log("Behavoirs of case: ", data);
      
            setCusNegotiationData({
              negotiation: data.caseDetails || [],
              paymentData: data.paymentData || [],
              additionalData: data.additionalData || [],
            });
          } catch (error) {
            console.log("Error: ", error);
          }
        };
      
        fetchData();
    }, [user?.drc_id, case_id]);
    
      
    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className={GlobalStyle.headingLarge}>Case Updates</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {["Customer Negotiation", "CPE Collect"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-2 ${
                            activeTab === tab
                                ? "border-b-2 border-blue-500 font-bold"
                                : "text-gray-500"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content for each tab */}
            <div className="flex flex-col">
                {/* Content for "CPE Collect" */}
                {activeTab === "CPE Collect" && (
                    <>
                        {/* Card Section */}
                        <div className="flex flex-col items-center justify-center mb-4">                        
                            <div className={`${GlobalStyle.cardContainer}`}>
                                {[
                                    { label: "Case ID", value: cusNegotiationData?.caseDetails?.case_id },
                                    { label: "Customer Ref", value: cusNegotiationData?.caseDetails?.customer_ref },
                                    { label: "Account No", value: cusNegotiationData?.caseDetails?.account_no },
                                ].map((item, index) => (
                                    <p key={index} className="mb-2 flex items-center">
                                        <strong className="w-40 text-left">{item.label}</strong>
                                        <span className="w-6 text-center">:</span>
                                        <span className="flex-1">{item.value || "N/A"}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                              
                        {cusNegotiationData?.caseDetails?.ref_products?.map((product, index) => (
                            <div key={index} className="overflow-hidden">
                                <button
                                    className="flex justify-between items-center w-full p-2 bg-[#384B5C] text-white mb-4 rounded-r-lg"
                                    onClick={() => handleAccordion(index)}
                                >
                                    <span>{`Equipment ${index + 1}`}</span>
                                    <span className="flex items-center justify-center pr-2">
                                        <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen === index ? "rotate-180" : "rotate-0"}`} />
                                    </span>
                                </button>
                                <div className={`transition-[max-height] duration-300 overflow-hidden ${isOpen === index ? "max-h-50" : "max-h-0"}`}>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className={`${GlobalStyle.cardContainer}`}>
                                            {[
                                                { label: "Product Label", value: product.product_label },
                                                { label: "Service Type", value: product.service },
                                                { label: "Service Address", value: product.service_address },
                                                { label: "Service Status", value: product.product_status },
                                                { label: "Ownership", value: product.product_ownership },
                                            ].map((item, index) => (
                                                <p key={index} className="mb-2 flex items-center">
                                                    <strong className="w-40 text-left">{item.label}</strong>
                                                    <span className="w-6 text-center">:</span>
                                                    <span className="flex-1">{item.value}</span>
                                                </p>
                                            ))}
                                        </div>
                            
                                    </div> 
                                    {/* Table for Negotiation History */}
                                    <h2 className={`${GlobalStyle.headingMedium} mb-4`}> Negotiation History </h2>
                                    <div className={`${GlobalStyle.tableContainer} mb-4`}>
                                        <table className={GlobalStyle.table}>
                                            <thead className={GlobalStyle.thead}>
                                                <tr>
                                                    <th className={GlobalStyle.tableHeader}>Date</th>
                                                    <th className={GlobalStyle.tableHeader}>Negotiation</th>
                                                    <th className={GlobalStyle.tableHeader}>Remark</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...(cusNegotiationData?.additionalData?.ro_negotiation || [])]
                                                    .sort((a, b) => new Date(b.calling_dtm) - new Date(a.calling_dtm)) // Sorting in descending order
                                                    .map((item, index) => (
                                                    <tr
                                                        key={item._id}
                                                        className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                                    >
                                                        <td className={GlobalStyle.tableData}>
                                                        {new Date(item.calling_dtm).toLocaleDateString("en-CA") || "N/A"}
                                                        </td>
                                                        <td className={GlobalStyle.tableData}>{item.feild_reason}</td>
                                                        <td className={GlobalStyle.tableData}>{item.remark}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>                           
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                        

                        {/* Table for Last Negotiation Details
                        <h2 className={`${GlobalStyle.headingMedium} mb-4`}>Last Negotiation Detail</h2>
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Date</th>
                                        <th className={GlobalStyle.tableHeader}>Negotiation</th>
                                        <th className={GlobalStyle.tableHeader}>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cpeData.map((item, index) => (
                                        <tr
                                            key={item.date}
                                            className={
                                                index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                            }
                                        >
                                            <td className={GlobalStyle.tableData}>{item.date}</td>
                                            <td className={GlobalStyle.tableData}>{item.negotiation}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                    </>
                )}

                {/* Content for "Customer Negotiation" */}
                {activeTab === "Customer Negotiation" && (
                    <>
                        <div className={`${GlobalStyle.cardContainer}`}>
                            {[
                                { label: "Case ID", value: cusNegotiationData?.caseDetails?.case_id},
                                { label: "Customer Ref", value: cusNegotiationData?.caseDetails?.customer_ref },
                                { label: "Account No", value: cusNegotiationData?.caseDetails?.account_no },
                                { label: "Arrears Amount", value: cusNegotiationData?.caseDetails?.current_arrears_amount },
                                { label: "Last Payment Date", value: new Date(cusNegotiationData?.caseDetails?.last_payment_date).toLocaleDateString("en-CA")},
                            ].map((item, index) => (
                                <p key={index} className="mb-2 flex items-center">
                                    <strong className="w-40 text-left">{item.label}</strong>
                                    <span className="w-6 text-center">:</span>
                                    <span className="flex-1">{item.value || "N/A"}</span>
                                </p>
                            ))}
                        </div>

                        {/* Content for the Negotiation History Detail Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4`}> Negotiation History </h2>
                        {/* Table Section */}
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}> Calling Date </th>
                                        <th className={GlobalStyle.tableHeader}> Customer Represented </th>
                                        <th className={GlobalStyle.tableHeader}> Agree to Settle </th>
                                        <th className={GlobalStyle.tableHeader}> Field Reason </th>
                                        <th className={GlobalStyle.tableHeader}> Remark </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cusNegotiationData?.additionalData?.ro_negotiation?.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className={
                                                index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                            }
                                        >
                                            <td className={GlobalStyle.tableData}>{new Date(item.calling_dtm).toLocaleDateString("en-CA") || "N/A"}</td>
                                            <td className={GlobalStyle.tableData}>{item.feild_reason}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>                           
                        </div>

                        {/* Content for the Payment Details Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4  mt-4`}> Payment Details </h2>
                        {/* Table Section */}                     
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Created Date</th>
                                        <th className={GlobalStyle.tableHeader}>Status</th>
                                        <th className={GlobalStyle.tableHeader}>Expired On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={GlobalStyle.tableRowEven}>
                                        <td className={GlobalStyle.tableData}>
                                            {new Date(cusNegotiationData?.settlementData?.calling_dtm).toLocaleDateString("en-CA") || "N/A"}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {cusNegotiationData?.settlementData?.settlement_status}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {new Date(cusNegotiationData?.settlementData?.expire_date).toLocaleDateString("en-CA") || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        

                        {/* Content for the Requests Details Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4  mt-4`}>Requested Additional Details</h2>
                        {/* Table Section */}
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Date</th>
                                        <th className={GlobalStyle.tableHeader}>Request</th>
                                        <th className={GlobalStyle.tableHeader}>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cusNegotiationData?.additionalData?.customer_represented?.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className={
                                                index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                            }
                                        >
                                            <td className={GlobalStyle.tableData}>{new Date(item.calling_dtm).toLocaleDateString("en-CA") || "N/A"}</td>
                                            <td className={GlobalStyle.tableData}>{item.customer_represented|| "N/A"}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
