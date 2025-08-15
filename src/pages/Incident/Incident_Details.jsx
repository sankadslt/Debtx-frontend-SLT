 /*Purpose:
Created Date: 2025-08-17
Created By: Yugani Gunarathna (yuganesha027g@gmail.com)
Last Modified Date: 2025-08-05
Last Modified Date: 2025-05-08
Modified By:  Yugani Gunarathna 
              Dinithi Wijesekara 
              Update 2025-08-13
             
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS and connects to Incident collection with Account Number filtering */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchIncidentDetails, Create_Task_For_Download_Incident_Details } from '../../services/Incidents/incidentService.js';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const IncidentDetails = () => {
    const [incidentData, setIncidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [currentIndices, setCurrentIndices] = useState({});
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const incidentId = location.state?.IncidentID || location.state?.incidentId || location.state?.CaseID;

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

    useEffect(() => {
        const loadIncidentDetails = async () => {
            try {
                const response = await fetchIncidentDetails(incidentId);

                if (response.success) {
                    setIncidentData(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Failed to load incident details',
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#d33"
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to load incident details',
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#d33"
                });
            } finally {
                setLoading(false);
            }
        };

        loadIncidentDetails();
    }, [incidentId]);

    const toggleSection = (sectionName) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));

        if (!currentIndices[sectionName]) {
            setCurrentIndices(prev => ({
                ...prev,
                [sectionName]: 0
            }));
        }
    };

    const navigateCard = (sectionKey, direction) => {
        const sectionData = getSectionData(sectionKey);
        const maxIndex = Array.isArray(sectionData) ? sectionData.length - 1 : 0;

        setCurrentIndices(prev => {
            const currentIndex = prev[sectionKey] || 0;
            let newIndex = currentIndex;

            if (direction === 'next') {
                newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
            } else {
                newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
            }

            return {
                ...prev,
                [sectionKey]: newIndex
            };
        });
    };

    const getSectionData = (sectionKey) => {
        const sectionMap = {
            'contactDetails': incidentData?.contactDetails,
            'productDetails': incidentData?.productDetails,
            'customerDetails': incidentData?.customerDetails,
            'accountDetails': incidentData?.accountDetails,
            'lastActions': incidentData?.lastActions,
            'marketingDetails': incidentData?.marketingDetails,
            'drc': incidentData?.drcInfo,
            'roNegotiations': incidentData?.roNegotiations,
            'roCpeCollections': incidentData?.roCpeCollections,
            'roCustomerUpdates': incidentData?.roCustomerUpdates,
            'mediationBoard': incidentData?.mediationBoard,
            'settlements': incidentData?.settlements,
            'payments': incidentData?.payments,
            'ftlLod': incidentData?.ftlLodLetterDetails,
            'remark': incidentData?.remark,
            'approvals': incidentData?.approvals,
            'statusHistory': incidentData?.statusHistory,
            'actionsTaken': incidentData?.actionsTaken,
            'documents': incidentData?.documents,
            'refProducts': incidentData?.refProducts,
            'roRequests': incidentData?.roRequests,
            'litigation': incidentData?.litigationInfo,
            'lodFinalReminder': incidentData?.lodFinalReminder
        };
        
        return sectionMap[sectionKey];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString("en-GB") || "";
        } catch {
            return dateString;
        }
    };

    const renderCard = (data, title) => {
        if (!data) return <p className="text-gray-500">No data available</p>;

        // Handle array data - display as table
        if (Array.isArray(data)) {
            if (data.length === 0) return <p className="text-gray-500">No data available</p>;
            
            const keys = Object.keys(data[0]);
            
            return (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                {keys.map((key) => (
                                    <th key={key} className="bg-gray-50 border border-gray-200 px-8 py-4 text-left text-base font-semibold text-gray-700 min-w-[150px]">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    {keys.map((key) => (
                                        <td key={key} className="border border-gray-200 px-8 py-4 text-base text-gray-900 min-w-[150px]">
                                            {key.includes('date') || key.includes('dtm') || key.includes('Dtm')
                                                ? formatDate(item[key])
                                                : (item[key] === null || item[key] === undefined
                                                    ? ''
                                                    : item[key].toString())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Handle DRC special case with recovery officers
        if (title === "DRC" && data.recoveryOfficers) {
            return (
                <div className="space-y-6">
                    {/* Main DRC Info Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="bg-gray-50 border border-gray-200 px-8 py-4 text-left text-base font-semibold text-gray-700 w-1/3 min-w-[200px]">Field</th>
                                    <th className="bg-gray-50 border border-gray-200 px-8 py-4 text-left text-base font-semibold text-gray-700 w-2/3 min-w-[300px]">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data)
                                    .filter(([key]) => key !== 'recoveryOfficers')
                                    .map(([key, value], index) => (
                                        <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="border border-gray-200 px-8 py-4 text-base text-gray-700 font-medium">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </td>
                                            <td className="border border-gray-200 px-8 py-4 text-base text-gray-900">
                                                {key.includes('date') || key.includes('dtm') || key.includes('Dtm')
                                                    ? formatDate(value)
                                                    : (value === null || value === undefined
                                                        ? ''
                                                        : value.toString())}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recovery Officers Table */}
                    {data.recoveryOfficers && data.recoveryOfficers.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-base font-medium text-gray-600 mb-3">Recovery Officers</h3>
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                                    <thead>
                                        <tr>
                                            {Object.keys(data.recoveryOfficers[0]).map((key) => (
                                                <th key={key} className="bg-gray-50 border border-gray-200 px-8 py-4 text-left text-base font-semibold text-gray-700 min-w-[150px]">
                                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recoveryOfficers.map((officer, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                {Object.entries(officer).map(([key, value]) => (
                                                    <td key={key} className="border border-gray-200 px-8 py-4 text-base text-gray-900 min-w-[150px]">
                                                        {key.includes('date') || key.includes('dtm') || key.includes('Dtm')
                                                            ? formatDate(value)
                                                            : (value === null || value === undefined
                                                                ? ''
                                                                : value.toString())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Handle object data - display as card format like Case Details
        return (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-600">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </label>
                            <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                                {key.includes('date') || key.includes('dtm') || key.includes('Dtm')
                                    ? formatDate(value)
                                    : (value === null || value === undefined
                                        ? ''
                                        : value.toString())}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBasicInfoCard = (incidentData) => {
        if (!incidentData) return null;

        const infoFields = [
            [
                { label: 'Account No', value: incidentData.basicInfo?.accountNum || '' },
                { label: 'Customer Name', value: incidentData.basicInfo?.customerName || '' },
                { label: 'Incident ID', value: incidentData.incidentInfo?.incidentId || '' },
                { label: 'Customer Type', value: incidentData.basicInfo?.customerType || '' },
                { label: 'Arrears Band', value: incidentData.basicInfo?.arrearsBand || '' },
                { label: 'Customer Ref', value: incidentData.basicInfo?.customerRef || '' },
            ],
            [
                { label: 'RTOM', value: incidentData.basicInfo?.rtom || '' },
                { label: 'Arrears Amount', value: incidentData.basicInfo?.arrearsAmount || '' },
                { label: 'Action Type', value: incidentData.basicInfo?.actionType || '' },
                { label: 'Area', value: incidentData.basicInfo?.area || '' },
                { label: 'Region', value: incidentData.basicInfo?.region || '' },
                { label: 'Account Manager Code', value: incidentData.basicInfo?.accountManagerCode || '' },
            ],
            [
                { label: 'DRC Commission Rule', value: incidentData.incidentInfo?.drcCommissionRule || '' },
                { label: 'Monitor Months', value: incidentData.basicInfo?.monitorMonths || '' },
                { label: 'Commission', value: incidentData.basicInfo?.commission || '' },
                { label: 'Case Distribution Batch ID', value: incidentData.basicInfo?.caseDistributionBatchId || '' },
                { label: 'Filtered Reason', value: incidentData.basicInfo?.filteredReason || '' },
                { label: 'BSS Arrears Amount', value: incidentData.basicInfo?.bssArrearsAmount || '' },
            ],
            [
                { label: 'Current Status', value: incidentData.incidentInfo?.incidentStatus || '' },
                { label: 'Status Description', value: incidentData.incidentInfo?.statusDescription || '' },
                { label: 'Created By', value: incidentData.incidentInfo?.createdBy || '' },
                { label: 'Proceed By', value: incidentData.incidentInfo?.proceedBy || '' },
                { label: 'Last Payment Date', value: formatDate(incidentData.basicInfo?.lastPaymentDate) },
                { label: 'Last BSS Reading Date', value: formatDate(incidentData.basicInfo?.lastBssReadingDate) },
            ],
        ];

        return (
            <div className={`${GlobalStyle.cardContainer} p-6 mb-8`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {infoFields.map((column, colIndex) => (
                        <div key={`col-${colIndex}`} className="space-y-4">
                            {column.map((field, fieldIndex) => (
                                <div key={`field-${colIndex}-${fieldIndex}`} className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-700 mb-1">{field.label}:</span>
                                    <span className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                                        {field.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {(incidentData.basicInfo?.remark || incidentData.basicInfo?.remarks) && (
                    <div className="flex flex-col mt-4">
                        <span className="text-sm font-semibold text-gray-700 mb-2">Remark:</span>
                        <div className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded border min-h-[60px]">
                            {incidentData.basicInfo?.remark || incidentData.basicInfo?.remarks || 'No remarks available'}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const CollapsibleSection = ({ title, children, sectionKey }) => {
        const isOpen = openSections[sectionKey];
        const currentIndex = currentIndices[sectionKey] || 0;
        const sectionData = getSectionData(sectionKey);
        const totalItems = Array.isArray(sectionData) ? sectionData.length : 0;

        return (
            <div className="mb-2">
                <div
                    className="bg-[rgb(30_38_89)] text-white p-3 rounded-lg cursor-pointer flex justify-between items-center hover:bg-[rgb(40_48_100)] transition-colors"
                    onClick={() => toggleSection(sectionKey)}
                >
                    <span className="font-medium">{title}</span>
                    <div className="flex items-center space-x-2">
                        {isOpen && totalItems > 1 && (
                            <span className="text-sm bg-slate-500 px-2 py-1 rounded">
                                {currentIndex + 1} of {totalItems}
                            </span>
                        )}
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
                {isOpen && (
                    <div className="bg-white border border-slate-200 p-4 rounded-b-lg">
                        {children}
                        {totalItems > 1 && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigateCard(sectionKey, 'prev')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={() => navigateCard(sectionKey, 'next')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <span>Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleDownloadClick = async () => {
        const userData = await getLoggedUserId(); 
        setIsCreatingTask(true);

        try {
            const response = await Create_Task_For_Download_Incident_Details(userData);
            if(response === "success"){
                Swal.fire({
                    title: response,
                    text: 'Task created successfully!',
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
            }
        } catch(error){
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        } finally{
            setIsCreatingTask(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!incidentData) {
        return (
            <div className="font-sans p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-600">No incident data found</div>
            </div>
        );
    }

    return (
        <div className="font-sans p-6 min-h-screen relative">
            <div className="relative z-10 mb-8">
                <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Incident Details</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 min-w-64">
                        <div className="grid grid-cols-2 gap-x-8">
                            {/* Left column: first 4 items */}
                            <div className="space-y-2">
                                {[
                                    { label: 'Incident ID', value: incidentData.incidentInfo?.incidentId },
                                    { label: 'Created Dtm', value: formatDate(incidentData.incidentInfo?.createdDtm) },
                                    { label: 'Days Count', value: incidentData.incidentInfo?.daysCount },
                                    { label: 'Incident Status', value: incidentData.incidentInfo?.incidentStatus },
                                ].map((item, index) => (
                                    <div key={`left-incident-info-${index}`} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{item.label}:</span>
                                        <span className={`text-sm ${index === 0 ? 'font-bold' : ''} text-gray-900`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Right column: remaining items */}
                            <div className="space-y-2">
                                {[
                                    { label: 'Direction', value: incidentData.incidentInfo?.incidentDirection },
                                    { label: 'Action', value: incidentData.incidentInfo?.action },
                                    { label: 'Source Type', value: incidentData.incidentInfo?.sourceType },
                                    { label: 'DRC Commission Rule', value: incidentData.incidentInfo?.drcCommissionRule },
                                ].map((item, index) => (
                                    <div key={`right-incident-info-${index}`} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{item.label}:</span>
                                        <span className="text-sm text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {renderBasicInfoCard(incidentData)}

            <div className="space-y-2 mb-8">
                {incidentData.contactDetails && (
                    <CollapsibleSection title="Contact Details" sectionKey="contactDetails">
                        {renderCard(incidentData.contactDetails[currentIndices['contactDetails'] || 0], "Contact Details")}
                    </CollapsibleSection>
                )}

                {incidentData.productDetails && (
                    <CollapsibleSection title="Product Details" sectionKey="productDetails">
                        {renderCard(incidentData.productDetails[currentIndices['productDetails'] || 0], "Product Details")}
                    </CollapsibleSection>
                )}

               

              

                {incidentData.lastActions && (
                    <CollapsibleSection title="Last Actions" sectionKey="lastActions">
                        {renderCard(incidentData.lastActions[currentIndices['lastActions'] || 0], "Last Actions")}
                    </CollapsibleSection>
                )}

                {incidentData.marketingDetails && (
                    <CollapsibleSection title="Marketing Details" sectionKey="marketingDetails">
                        {renderCard(incidentData.marketingDetails[currentIndices['marketingDetails'] || 0], "Marketing Details")}
                    </CollapsibleSection>
                )}

                {incidentData.drcInfo && (
                    <CollapsibleSection title="DRC" sectionKey="drc">
                        {renderCard(incidentData.drcInfo[currentIndices['drc'] || 0], "DRC")}
                    </CollapsibleSection>
                )}

                {incidentData.roNegotiations && (
                    <CollapsibleSection title="RO Negotiations" sectionKey="roNegotiations">
                        {renderCard(incidentData.roNegotiations[currentIndices['roNegotiations'] || 0], "RO Negotiations")}
                    </CollapsibleSection>
                )}

                {incidentData.roCpeCollections && (
                    <CollapsibleSection title="RO CPE Collections" sectionKey="roCpeCollections">
                        {renderCard(incidentData.roCpeCollections[currentIndices['roCpeCollections'] || 0], "RO CPE Collections")}
                    </CollapsibleSection>
                )}

                {incidentData.roCustomerUpdates && (
                    <CollapsibleSection title="RO Edited Customer Details" sectionKey="roCustomerUpdates">
                        {renderCard(incidentData.roCustomerUpdates[currentIndices['roCustomerUpdates'] || 0], "RO Edited Customer Details")}
                    </CollapsibleSection>
                )}

                {incidentData.mediationBoard && (
                    <CollapsibleSection title="Mediation Board" sectionKey="mediationBoard">
                        {renderCard(incidentData.mediationBoard[currentIndices['mediationBoard'] || 0], "Mediation Board")}
                    </CollapsibleSection>
                )}

                {incidentData.settlements && (
                    <CollapsibleSection title="Settlements" sectionKey="settlements">
                        {renderCard(incidentData.settlements[currentIndices['settlements'] || 0], "Settlements")}
                    </CollapsibleSection>
                )}

                {incidentData.payments && (
                    <CollapsibleSection title="Money Transactions" sectionKey="payments">
                        {renderCard(incidentData.payments[currentIndices['payments'] || 0], "Payments")}
                    </CollapsibleSection>
                )}

                {incidentData.ftlLodLetterDetails && (
                    <CollapsibleSection title="FTL LOD" sectionKey="ftlLod">
                        {renderCard(incidentData.ftlLodLetterDetails[currentIndices['ftlLod'] || 0], "FTL LOD")}
                    </CollapsibleSection>
                )}

                {incidentData.remark && (
                    <CollapsibleSection title="Remarks" sectionKey="remark">
                        {renderCard(incidentData.remark[currentIndices['remark'] || 0], "Remarks")}
                    </CollapsibleSection>
                )}

                {incidentData.approvals && (
                    <CollapsibleSection title="Approvals" sectionKey="approvals">
                        {renderCard(incidentData.approvals[currentIndices['approvals'] || 0], "Approvals")}
                    </CollapsibleSection>
                )}

                {incidentData.statusHistory && (
                    <CollapsibleSection title="Status History" sectionKey="statusHistory">
                        {renderCard(incidentData.statusHistory[currentIndices['statusHistory'] || 0], "Status History")}
                    </CollapsibleSection>
                )}

                {incidentData.actionsTaken && (
                    <CollapsibleSection title="Actions Taken" sectionKey="actionsTaken">
                        {renderCard(incidentData.actionsTaken[currentIndices['actionsTaken'] || 0], "Actions Taken")}
                    </CollapsibleSection>
                )}

                {incidentData.documents && (
                    <CollapsibleSection title="Documents" sectionKey="documents">
                        {renderCard(incidentData.documents[currentIndices['documents'] || 0], "Documents")}
                    </CollapsibleSection>
                )}

                {incidentData.refProducts && (
                    <CollapsibleSection title="Reference Products" sectionKey="refProducts">
                        {renderCard(incidentData.refProducts[currentIndices['refProducts'] || 0], "Reference Products")}
                    </CollapsibleSection>
                )}

                {incidentData.roRequests && (
                    <CollapsibleSection title="RO Requests" sectionKey="roRequests">
                        {renderCard(incidentData.roRequests[currentIndices['roRequests'] || 0], "RO Requests")}
                    </CollapsibleSection>
                )}

                {incidentData.litigationInfo && (
                    <CollapsibleSection title="Litigation Information" sectionKey="litigation">
                        {renderCard(incidentData.litigationInfo[currentIndices['litigation'] || 0], "Litigation Information")}
                    </CollapsibleSection>
                )}

                {incidentData.lodFinalReminder && (
                    <CollapsibleSection title="LOD Final Reminder" sectionKey="lodFinalReminder">
                        {renderCard(incidentData.lodFinalReminder[currentIndices['lodFinalReminder'] || 0], "LOD Final Reminder")}
                    </CollapsibleSection>
                )}
            </div>

            <div className="flex justify-between items-center">
                <button
                    className={`${GlobalStyle.buttonPrimary} p-3`}
                    onClick={handleBackClick}
                >
                    <ArrowLeft className="text-gray-600" size={20} />
                </button>

                <button
                    className={`${GlobalStyle.buttonPrimary} px-6 py-2`}
                    onClick={handleDownloadClick}
                    disabled={isCreatingTask}
                >
                    {isCreatingTask ? 'Creating...' : 'Download'}
                </button>
            </div>
        </div>
    );
};

export default IncidentDetails;
