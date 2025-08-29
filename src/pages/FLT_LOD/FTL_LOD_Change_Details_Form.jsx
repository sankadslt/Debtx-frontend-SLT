import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FTL_LOD_Case_Details, Create_FTL_LOD } from "../../services/FTL_LOD/FTL_LODServices.js";
import { getLoggedUserId, refreshAccessToken } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { Change_Details_FLT_LOD } from "../../services/FTL_LOD/FTL_LODServices.js";

export default function FTL_LOD_Change_Details_Form() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const case_id = state?.item?.case_id;
    
    // State to manage case details
    const [caseDetails, setCaseDetails] = useState({
        caseId: "",
        accountNo: "",
        customerName: "",
        address: "",
        arrears: "",
        billingCentre: "",
        customerType: "",
    });

    // State for form inputs and errors
    const [accountNo, setAccountNo] = useState("");
    const [accountNoInputs, setAccountNoInputs] = useState([""]);
    const [accountNoError, setAccountNoError] = useState("");
    const [selectOption, setSelectOption] = useState("");
    const [selectOptionError, setSelectOptionError] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerNameInputs, setCustomerNameInputs] = useState([""]);
    const [customerNameError, setCustomerNameError] = useState("");
    const [address, setAddress] = useState("");
        const [addressInputs, setAddressInputs] = useState([""]);
    const [addressError, setAddressError] = useState("");
    const [arrears, setArrears] = useState("");
    const [arrearsInputs, setArrearsInputs] = useState([""]);
    const [arrearsError, setArrearsError] = useState("");
    const [billingCentre, setBillingCentre] = useState("");
    const [billingCentreInputs, setBillingCentreInputs] = useState([""]);
    const [billingCentreError, setBillingCentreError] = useState("");
    const [customerType, setCustomerType] = useState("");
    const [customerTypeInputs, setCustomerTypeInputs] = useState([""]);
    const [customerTypeError, setCustomerTypeError] = useState("");
    const [remark, setRemark] = useState("");
    const [remarkError, setRemarkError] = useState("");
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isEdited, setIsEdited] = useState(false);

    // Role-based access control
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        try {
            let decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                refreshAccessToken().then((newToken) => {
                    if (!newToken) return;
                    const newDecoded = jwtDecode(newToken);
                    setUserRole(newDecoded.role);
                });
            } else {
                setUserRole(decoded.role);
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, []);

    // Load user data
    useEffect(() => {
        const loadUser = async () => {
            const user = await getLoggedUserId();
            setUserData(user);
        };
        loadUser();
    }, []);

    // Fetch case details
    const fetchCaseDetails = async () => {
        try {
            if (!case_id) {
                console.log("Missing case ID or DRC ID");
                return;
            }
           
            const caseDetailsData = await FTL_LOD_Case_Details(case_id);
            console.log("Case Details Data:", caseDetailsData);
            setCaseDetails({
                caseId: case_id || "",
                accountNo: caseDetailsData.data.account_no || "",
                customerName: caseDetailsData.data.customer_name || "",
                address: caseDetailsData.data.full_address,
                arrears:  caseDetailsData.data.current_arrears_amount,
                billingCentre: caseDetailsData.data.rtom || "",
                customerType: caseDetailsData.data.customer_type_name || "",
            });
            // Set form input states
            setAccountNo(caseDetailsData.data.account_no || "");
            setCustomerName(caseDetailsData.data.customer_name || "");
            setAddress(caseDetailsData.data.full_address);
            setArrears(caseDetailsData.data.current_arrears_amount ? `Rs. ${parseFloat(caseDetailsData.data.current_arrears_amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "");
            setBillingCentre(caseDetailsData.data.rtom || "");
            setCustomerType(caseDetailsData.data.customer_type_name || "");
        } catch (error) {
            console.error("Error fetching case details:", error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch case details. Please try again.',
                confirmButtonColor: "#d33",
            });
        }
    };

  useEffect(() => {
    if (case_id) {
        fetchCaseDetails().catch(console.error);
    }
}, [case_id]);

    // Input validation handlers
    const handleAccountNoChange = (index, value) => {
        const updatedAccountNo = [...accountNoInputs];
        updatedAccountNo[index] = value;
        setAccountNoInputs(updatedAccountNo);
        setAccountNo(value.trim());

        // Clear account number error when user starts typing
        if (accountNoError && value.trim()) {
            setAccountNoError("");
        }
        // const value = e.target.value;
        // setAccountNo(value);
        if (value && !/^[A-Z0-9-]{6,15}$/i.test(value)) {
            setAccountNoError("Invalid account number. Alphanumeric, 6-15 characters.");
        } else {
            setAccountNoError("");
        }
    };

    const handleSelectOptionChange = (e) => {
        const value = e.target.value;
        setSelectOption(value);
        if (!value) {
            setSelectOptionError("Please select an option.");
        } else {
            setSelectOptionError("");
        }
    };

    const handleCustomerNameChange = (index, value) => {
        // const value = e.target.value;
        // setCustomerName(value);
        // if (value && !/^[A-Za-z\s]{2,50}$/.test(value)) {
        //     setCustomerNameError("Invalid name. Letters and spaces only, 2-50 characters.");
        // } else {
        //     setCustomerNameError("");
        // }

        const updatedCustomerName = [...customerNameInputs];
        updatedCustomerName[index] = value;
        setCustomerNameInputs(updatedCustomerName);
        setCustomerName(value.trim());

        // Clear customer name error when user starts typing
        if (customerNameError && value.trim()) {
            setCustomerNameError("");
        }
    };

    const handleAddressChange = (index, value) => {
         const updatedAddresses = [...addressInputs];
        
          updatedAddresses[index] = value;
        setAddressInputs(updatedAddresses);
        setAddress(value.trim());

        // Clear address error when user starts typing
        if (addressError && value.trim()) {
            setAddressError("");
        }
        //  const value = e.target.value;
        // setAddress(value);
        // if (value && value.length < 5) {
        //     setAddressError("Address must be at least 5 characters long.");
        // } else {
        //     setAddressError("");
        // }
    };

    const handleArrearsChange = (index, value) => {
        const updatedArrears = [...arrearsInputs];
        updatedArrears[index] = value;
        setArrearsInputs(updatedArrears);
        setArrears(value.trim());

        // Clear arrears error when user starts typing
        if (arrearsError && value.trim()) {
            setArrearsError("");
        }
        if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
            setArrearsError("Invalid arrears amount. Must be a valid number (e.g., 1000.00).");
        } else {
            setArrearsError("");
        }
    };

    const handleBillingCentreChange = (index, value) => {
        const updatedBillingCentres = [...billingCentreInputs];
        updatedBillingCentres[index] = value;
        setBillingCentreInputs(updatedBillingCentres);
        setBillingCentre(value.trim());

        // Clear billing centre error when user starts typing
        if (billingCentreError && value.trim()) {
            setBillingCentreError("");
        }
        if (value && !/^[A-Za-z0-9\s-]{3,50}$/.test(value)) {
            setBillingCentreError("Invalid billing centre. Alphanumeric, 3-50 characters.");
        } else {
            setBillingCentreError("");
        }

        
    };

    const handleCustomerTypeChange = (index, value) => {
        const updatedCustomerTypes = [...customerTypeInputs];
        updatedCustomerTypes[index] = value;
        setCustomerTypeInputs(updatedCustomerTypes);
        setCustomerType(value.trim());

        // Clear customer type error when user starts typing
        if (customerTypeError && value.trim()) {
            setCustomerTypeError("");
        }
        if (value && !/^[A-Za-z\s]{3,30}$/.test(value)) {
            setCustomerTypeError("Invalid customer type. Letters and spaces only, 3-30 characters.");
        } else {
            setCustomerTypeError("");
        }
    };
        // Clear billing centre error when user starts typing
      
    

    const handleRemarkChange = (e) => {
        const value = e.target.value;
        setRemark(value);
        if (value && value.length < 5) {
            setRemarkError("Remark must be at least 5 characters long.");
        } else {
            setRemarkError("");
        }
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!accountNo || !selectOption || !customerName || !address  || !billingCentre || !customerType || !remark) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Warning',
        //         text: 'Please fill in all required fields before submitting.',
        //         confirmButtonColor: "#f1c40f",
        //     });
        //     return;
        // }

        const userDataID = await getLoggedUserId();
        console.log("User Data ID:", userDataID);
        let payload = {
            
            case_id: Number(case_id),
            // pdf_by: userDataID,
            // signed_by: userDataID,req
            customer_name: customerName,
            created_by: userDataID,
            // account_no: accountNo,
            
            
            postal_address: address,
            event_source: selectOption,
            // arrears: Number(arrears),
            // billing_centre: billingCentre,
            // customer_type: customerType,
            // remark: remark,
            // edited_by: userDataID.user_id,
        };

        // Check for changes
        
        // if (accountNo !== caseDetails.accountNo) payload.edited_account_no = accountNo;
        // if (selectOption) payload.edited_event_source = selectOption;
        // if (customerName !== caseDetails.customerName) payload.edited_customer_name = customerName;
        // if (address !== caseDetails.address) payload.edited_address = address;
        // if (arrears !== caseDetails.arrears) payload.edited_arrears = Number(arrears);
        // if (billingCentre !== caseDetails.billingCentre) payload.edited_billing_centre = billingCentre;
        // if (customerType !== caseDetails.customerType) payload.edited_customer_type = customerType;

        // if (Object.keys(payload).length <= 2) { // Only case_id, edited_by
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'No Changes Detected',
        //         text: 'No changes were made to the form.',
        //         confirmButtonColor: "#f1c40f",
        //     });
        //     return;
        // }

        setIsEdited(true);

        Swal.fire({
            title: "Confirm Submission",
            text: "Are you sure you want to submit the form details?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log("Submitting payload:", payload);
                    const response = await Change_Details_FLT_LOD(payload);
                    console.log("Response from Create_FTL_LOD:", response);
                    if (response.message === "FTL LOD entry and case status updated successfully") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Data submitted successfully!',
                            confirmButtonColor: "#28a745",
                        });
                        setRemark("");
                        fetchCaseDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to submit data. Please try again.',
                            confirmButtonColor: "#d33",
                        });
                    }
                } catch (error) {
                    console.error("Error submitting data:", error);
                    const errorMessage = error.response?.data?.error || 'Failed to submit data. Please try again.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage,
                        confirmButtonColor: "#d33",
                    });
                }
            }
        });
    };

    const handleBack = () => {
        // navigate("/pages/flt-lod/ftl-lod-creation(preview-of-ftl-lod)", { state: { item: case_id } });
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className="flex justify-between items-center mb-8">
                <h1 className={GlobalStyle.headingLarge}>Change FTL LOD Details</h1>
            </div>

            {/* Case Details Display */}
            <div className="flex flex-col lg:flex-row items-stretch justify-center mb-4 gap-3">
                <div className={`${GlobalStyle.cardContainer} flex bg-white shadow-lg rounded-lg p-4 w-full lg:basis-[30%] lg:max-w-[30%]`} style={{ backgroundColor: "white" }}>
                    <table className={GlobalStyle.table}>
                        <tbody>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Case ID</strong></p></td>
                                <td className="text-black">: {caseDetails.caseId}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Account No</strong></p></td>
                                <td className="text-black">: {caseDetails.accountNo}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Customer Name</strong></p></td>
                                <td className="text-black">: {caseDetails.customerName}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Address</strong></p></td>
                                <td className="text-black">: {caseDetails.address}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Arrears</strong></p></td>
                                <td className="text-black">: {caseDetails.arrears && typeof caseDetails.arrears === 'number' ? caseDetails.arrears.toLocaleString("en-LK", { style: "currency", currency: "LKR" }) : caseDetails.arrears}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Billing Centre</strong></p></td>
                                <td className="text-black">: {caseDetails.billingCentre}</td>
                            </tr>
                            <tr>
                                <td className="text-black"><p className="mb-2"><strong>Customer Type</strong></p></td>
                                <td className="text-black">: {caseDetails.customerType}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form */}
            <div className={`${GlobalStyle.tableContainer} bg-white bg-opacity-50 p-8 max-w-4xl mx-auto`}>
                <table className={`${GlobalStyle.table} w-full text-left`}>
                    <tbody>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap underline sm:table-cell w-1/3 sm:w-1/4`}>Change Details</td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Account No: </td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={accountNo}
                                        onChange={(e) => handleAccountNoChange(0,e.target.value)}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter account number"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {accountNoError && <p style={{ color: "red", fontSize: "12px" }}>{accountNoError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Account No</td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <input
                                        type="text"
                                        value={accountNo}
                                        onChange={(e) => handleAccountNoChange(0,e.target.value)}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder={` "Enter account number"} `}
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {accountNoError && <p style={{ color: "red", fontSize: "12px" }}>{accountNoError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Event Source: </td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <select
                                        value={selectOption}
                                        onChange={handleSelectOptionChange}
                                        className={`${GlobalStyle.selectBox} w-full`}
                                    >
                                        <option value="">Select Event Source</option>
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                        <option value="option3">Option 3</option>
                                    </select>
                                    {selectOptionError && <p style={{ color: "red", fontSize: "12px" }}>{selectOptionError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Event Source</td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <select
                                        value={selectOption}
                                        onChange={handleSelectOptionChange}
                                        className={`${GlobalStyle.selectBox} w-full`}
                                    >
                                        <option value="">Select Event Source</option>
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                        <option value="option3">Option 3</option>
                                    </select>
                                    {selectOptionError && <p style={{ color: "red", fontSize: "12px" }}>{selectOptionError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Customer Name: </td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => { handleCustomerNameChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter customer name"
                                    />
                                    {customerNameError && <p style={{ color: "red", fontSize: "12px" }}>{customerNameError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Customer Name </td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => { handleCustomerNameChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter customer name"
                                    />
                                    {customerNameError && <p style={{ color: "red", fontSize: "12px" }}>{customerNameError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Address: </td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <textarea
                                        value={address}
                                        onChange={(e) =>{handleAddressChange(0, e.target.value)}}
                                        className={`${GlobalStyle.remark} w-full`}
                                        placeholder="Enter address"
                                    />
                                    {addressError && <p style={{ color: "red", fontSize: "12px" }}>{addressError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Address </td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <textarea
                                        value={address}
                                        onChange={(e) => { handleAddressChange(0, e.target.value) }}
                                        className={`${GlobalStyle.remark} w-full`}
                                        placeholder="Enter address"
                                    />
                                    {addressError && <p style={{ color: "red", fontSize: "12px" }}>{addressError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Arrears: </td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={arrears}
                                        onChange={(e) => { handleArrearsChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter arrears amount"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                    />
                                    {arrearsError && <p style={{ color: "red", fontSize: "12px" }}>{arrearsError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Arrears </td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <input
                                        type="text"
                                        value={arrears}
                                        onChange={(e) => { handleArrearsChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter arrears amount"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                    />
                                    {arrearsError && <p style={{ color: "red", fontSize: "12px" }}>{arrearsError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Billing Centre:</td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={billingCentre}
                                        onChange={(e) => { handleBillingCentreChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter billing centre"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {billingCentreError && <p style={{ color: "red", fontSize: "12px" }}>{billingCentreError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Billing Centre</td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <input
                                        type="text"
                                        value={billingCentre}
                                        onChange={(e) => { handleBillingCentreChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter billing centre"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {billingCentreError && <p style={{ color: "red", fontSize: "12px" }}>{billingCentreError}</p>}
                                </div>
                            </td>
                        </tr>
                        <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Customer Type:</td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={customerType}
                                        onChange={(e) => { handleCustomerTypeChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter customer type"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {customerTypeError && <p style={{ color: "red", fontSize: "12px" }}>{customerTypeError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Customer Type </td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <div className="flex justify-start w-full flex-col">
                                    <input
                                        type="text"
                                        value={customerType}
                                        onChange={(e) => { handleCustomerTypeChange(0, e.target.value) }}
                                        className={`${GlobalStyle.inputText} w-full`}
                                        placeholder="Enter customer type"
                                        disabled
                                         style={{ backgroundColor: '#e5e7eb', color: '#1f2937' }}
                                  
                                    />
                                    {customerTypeError && <p style={{ color: "red", fontSize: "12px" }}>{customerTypeError}</p>}
                                </div>
                            </td>
                        </tr>
                        {/* <tr className="block sm:table-row">
                            <td className={`${GlobalStyle.tableData} font-medium block sm:hidden`}>Remark: <span style={{ color: "red" }}>*</span></td>
                            <td className={`${GlobalStyle.tableData} block sm:hidden pl-4`}>
                                <div className="w-full">
                                    <textarea
                                        value={remark}
                                        onChange={handleRemarkChange}
                                        className={`${GlobalStyle.remark} w-full`}
                                        placeholder="Enter remark for this update..."
                                        rows="5"
                                    />
                                    {remarkError && <p style={{ color: "red", fontSize: "12px" }}>{remarkError}</p>}
                                </div>
                            </td>
                            <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>Remark <span style={{ color: "red" }}>*</span></td>
                            <td className="w-4 text-left hidden sm:table-cell">:</td>
                            <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                                <textarea
                                    value={remark}
                                    onChange={handleRemarkChange}
                                    className={`${GlobalStyle.remark} w-full`}
                                    placeholder="Enter remark for this update..."
                                    rows="5"
                                />
                                {remarkError && <p style={{ color: "red", fontSize: "12px" }}>{remarkError}</p>}
                            </td>
                        </tr> */}
                    </tbody>
                </table>
                <div className="flex justify-end items-center w-full mt-6">
                    {["admin", "superadmin", "slt", "drc_user", "drc_admin"].includes(userRole) && (
                        <button
                            className={`${GlobalStyle.buttonPrimary} ml-4 ${accountNoError || selectOptionError || customerNameError || addressError || billingCentreError || customerTypeError || remarkError ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleSubmit}
                            disabled={accountNoError || selectOptionError || customerNameError || addressError || billingCentreError || customerTypeError || remarkError}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-4" style={{ cursor: 'pointer' }}>
                <button className={GlobalStyle.buttonPrimary} onClick={handleBack}>
                    <FaArrowLeft className="mr-2" />
                </button>
            </div>
        </div>
    );
};