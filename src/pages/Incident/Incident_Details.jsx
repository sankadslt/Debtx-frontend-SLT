/*Purpose:
Created Date: 2025-08-17
Created Date: 2025-08-05
Created By: Yugani Gunarathna (yuganesha027g@gmail.com)
Last Modified Date: 2025-08-05
Last Modified Date: 2025-05-08
Modified By:  Yugani Gunarathna 
              Dinithi Wijesekara 
Last Modified Date: 2025-08-05
Modified By:  Yugani Gunarathna
              Dinithi Wijesekara
              Update 2025-08-14 */
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

    const incidentId = location.state?.IncidentID || location.state?.incidentId;

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
                    console.log('Incident Data Structure:', response.data);
                    console.log('Raw fields available:', Object.keys(response.data));
                    console.log('Arrays in data:', Object.entries(response.data).filter(([key, value]) => Array.isArray(value)).map(([key, value]) => `${key}: ${value.length} items`));
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

    // Get navigation data for a section
    const getNavigationData = (sectionKey) => {
        if (!incidentData) return null;
        
        // Check if navigation metadata exists
        if (incidentData.navigation && incidentData.navigation[sectionKey]) {
            return incidentData.navigation[sectionKey];
        }
        
        // Fallback to actual array length
        const sectionData = getSectionData(sectionKey, incidentData);
        if (Array.isArray(sectionData) && sectionData.length > 0) {
            return {
                currentIndex: currentIndices[sectionKey] || 0,
                totalCount: sectionData.length,
                hasNext: (currentIndices[sectionKey] || 0) < sectionData.length - 1,
                hasPrevious: (currentIndices[sectionKey] || 0) > 0
            };
        }
        
        return null;
    };

    const getSectionData = (sectionKey) => {
        const sectionMap = {
            // API formatted fields (camelCase)
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
            'lodFinalReminder': incidentData?.lodFinalReminder,
            
            // Fallback to raw fields for direct data
            'rawContactDetails': incidentData?.Contact_Details,
            'rawProductDetails': incidentData?.Product_Details,
            'rawCustomerDetails': incidentData?.Customer_Details,
            'rawAccountDetails': incidentData?.Account_Details,
            'rawLastActions': incidentData?.Last_Actions,
            'rawMarketingDetails': incidentData?.Marketing_Details,
            
            'processingInfo': incidentData?.processingInfo || (incidentData ? {
                'File_Name_Dump': incidentData.File_Name_Dump,
                'Incident_Log_Id': incidentData.Incident_Log_Id,
                'Batch_Id': incidentData.Batch_Id,
                'Batch_Id_Tag_Dtm': incidentData.Batch_Id_Tag_Dtm,
                'External_Data_Update_On': incidentData.External_Data_Update_On,
                'Export_On': incidentData.Export_On,
                'File_Name_Rejected': incidentData.File_Name_Rejected,
                'Rejected_Reason': incidentData.Rejected_Reason,
                'Incident_Forwarded_By': incidentData.Incident_Forwarded_By,
                'Incident_Forwarded_On': incidentData.Incident_Forwarded_On,
                'Rejected_By': incidentData.Rejected_By,
                'Rejected_Dtm': incidentData.Rejected_Dtm
            } : null),
            'rawData': incidentData // This will show all raw fields
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
        if (!data) return null;

        // Handle array data - display as table
        if (Array.isArray(data)) {
            if (data.length === 0) return null;
            
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
                                                : (item[key] === null || item[key] === undefined || item[key] === '' || item[key] === 'null' || item[key] === 'NULL'
                                                    ? '-'
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

       
       
      return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-2 min-h-[80px]">
                    <label className="text-base font-medium text-gray-600">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                    </label>
                    <div className="text-base text-gray-900 bg-white px-4 py-3 rounded border min-h-[40px] flex items-center">
                        {key.includes('date') || key.includes('dtm')
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
                { label: 'Incident ID', value: getValue('incidentInfo.incidentId', 'Incident_Id') },
                { label: 'Case ID', value: getValue('caseId', 'Case_Id') },
                { label: 'Doc Version', value: getValue('docVersion', 'DocVersion') },
                { label: 'Customer Name', value: getValue('basicInfo.customerName', 'Customer_Details.Customer_Name') },
                { label: 'Arrears Amount', value: getValue('basicInfo.arrearsAmount', 'Arrears') },
               
            ],
            
            [
                 { label: 'Account No', value: getValue('basicInfo.accountNum', 'Account_Num') },
                { label: 'Created By', value: getValue('incidentInfo.createdBy', 'Created_By') },
                { label: 'Arrears Band', value: getValue('basicInfo.arrearsBand', 'Arrears_Band') },
                { label: 'DRC Commission Rule', value: getValue('incidentInfo.drcCommissionRule', 'Drc_Commision_Rule') },
                { label: 'Created Date', value: formatDate(getValue('incidentInfo.createdDtm', 'Created_Dtm')) },
              
            ], 

            [
                  { label: 'Current Status', value: getValue('incidentInfo.incidentStatus', 'Incident_Status') },
                { label: 'Incident Status Date', value: formatDate(getValue('incidentInfo.incidentStatusDtm', 'Incident_Status_Dtm')) },
                { label: 'Status Description', value: getValue('incidentInfo.statusDescription', 'Status_Description') },
                 { label: 'File Name Dump', value: getValue('fileNameDump', 'File_Name_Dump') },
                { label: 'Incident Log ID', value: getValue('incidentLogId', 'Incident_Log_Id') },
                
                
            ],
            [
                { label: 'Batch ID', value: getValue('batchId', 'Batch_Id') },
                { label: 'Batch ID Tag Date', value: formatDate(getValue('batchIdTagDtm', 'Batch_Id_Tag_Dtm')) },
                { label: 'External Data Update On', value: formatDate(getValue('externalDataUpdateOn', 'External_Data_Update_On')) },         
                { label: 'Filtered Reason', value: getValue('basicInfo.filteredReason', 'Filtered_Reason') },
                { label: 'Export On', value: formatDate(getValue('exportOn', 'Export_On')) },
               

               
               
            ],
            [
                
                 { label: 'File Name Rejected', value: getValue('fileNameRejected', 'File_Name_Rejected') },
                { label: 'Rejected Reason', value: getValue('rejectedReason', 'Rejected_Reason') },
                { label: 'Incident Forwarded By', value: getValue('incidentInfo.incidentForwardedBy', 'Incident_Forwarded_By') },
                { label: 'Incident Forwarded On', value: formatDate(getValue('incidentInfo.incidentForwardedOn', 'Incident_Forwarded_On')) },
                { label: 'Proceed Date', value: formatDate(getValue('incidentInfo.proceedDtm', 'Proceed_Dtm')) },
               
                
            ],
            [
                
                 { label: 'Proceed By', value: getValue('incidentInfo.proceedBy', 'Proceed_By') },
                 { label: 'Validity Period', value: getValue('validityPeriod', 'Validity_period') },
                { label: 'Remark', value: getValue('remark', 'Remark') },
                 { label: 'Updated At', value: formatDate(getValue('updatedAt', 'updatedAt')) },
               { label: 'Rejected By', value: getValue('rejectedBy', 'Rejected_By') },
                
               
            ],
            [
               { label: 'Rejected Date', value: formatDate(getValue('rejectedDtm', 'Rejected_Dtm')) },            
               { label: 'Actions', value: getValue('incidentInfo.action', 'Actions') },
               { label: 'Source Type', value: getValue('incidentInfo.sourceType', 'Source_Type') },
               { label: 'Incident Direction', value: getValue('incidentInfo.incidentDirection', 'Incident_direction') },
               
               
            ],
        ];

        return (
           <div className={`${GlobalStyle.cardContainer} p-6 mb-8 w-full max-w-[1600px] mx-auto`}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {infoFields.map((column, colIndex) => (
            <div key={`col-${colIndex}`} className="space-y-4">
                {column.map((field, fieldIndex) => (
                    <div key={`field-${colIndex}-${fieldIndex}`} className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 mb-1">{field.label}:</span>
                        <span className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded border border-gray-200 w-full">
                            {field.value}
                        </span>
                    </div>
                ))}
            </div>
        ))}
    </div>
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
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
                {isOpen && (
                    <div className="bg-white border border-slate-200 p-4 rounded-b-lg">
                        {/* Navigation controls */}
                        {totalItems > 1 && (
                            <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border">
                                <button
                                    onClick={() => navigateCard(sectionKey, 'prev')}
                                    className="flex items-center space-x-2 px-3 py-2 bg-transparent text-gray-700 border border-gray-300 rounded hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    disabled={currentIndex === 0}
                                >
                                    <ChevronUp className="rotate-[-90deg]" size={16} />
                                    <span>Previous</span>
                                </button>
                                
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {currentIndex + 1} of {totalItems}
                                    </span>
                                    {/* Show navigation metadata if available */}
                                    {(() => {
                                        const navData = getNavigationData(sectionKey);
                                        return navData && navData.totalCount !== totalItems ? (
                                            <span className="text-xs text-gray-500">
                                                (Total: {navData.totalCount})
                                            </span>
                                        ) : null;
                                    })()}
                                </div>
                                
                                <button
                                    onClick={() => navigateCard(sectionKey, 'next')}
                                    className="flex items-center space-x-2 px-3 py-2 bg-transparent text-gray-700 border border-gray-300 rounded hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    disabled={currentIndex === totalItems - 1}
                                >
                                    <span>Next</span>
                                    <ChevronUp className="rotate-90" size={16} />
                                </button>
                            </div>
                        )}
                        
                        {children}
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

    // Function to safely get value from formatted API data
    const getValue = (formattedPath, rawField) => {
        // First check formatted path (new API structure)
        if (formattedPath) {
            const pathParts = formattedPath.split('.');
            let value = incidentData;
            
            for (const part of pathParts) {
                if (value && typeof value === 'object') {
                    value = value[part];
                } else {
                    value = undefined;
                    break;
                }
            }
            
            if (value !== undefined && value !== null && value !== '' && value !== 'null' && value !== 'NULL') {
                return value;
            }
        }
        
        // Fallback to raw field access (for backward compatibility)
        const rawValue = incidentData[rawField];
        if (rawValue !== undefined && rawValue !== null && rawValue !== '' && rawValue !== 'null' && rawValue !== 'NULL') {
            return rawValue;
        }
        
        // Handle nested field access for Product_Details array (raw)
        if (rawField.includes('Product_Details.0.')) {
            const fieldPath = rawField.replace('Product_Details.0.', '');
            const productValue = incidentData.Product_Details?.[0]?.[fieldPath] || incidentData.productDetails?.[0]?.[fieldPath];
            if (productValue !== undefined && productValue !== null && productValue !== '' && productValue !== 'null' && productValue !== 'NULL') {
                return productValue;
            }
        }
        
        // Handle nested field access for Customer_Details (raw)
        if (rawField.includes('Customer_Details.')) {
            const fieldPath = rawField.replace('Customer_Details.', '');
            const customerValue = incidentData.Customer_Details?.[fieldPath] || incidentData.customerDetails?.[fieldPath];
            if (customerValue !== undefined && customerValue !== null && customerValue !== '' && customerValue !== 'null' && customerValue !== 'NULL') {
                return customerValue;
            }
        }
        
        // Try alternative field names
        const alternativeFields = {
            'Actions': ['action', 'incidentInfo.action'],
            'Source_Type': ['sourceType', 'incidentInfo.sourceType'],
            'Incident_direction': ['incidentDirection', 'incidentInfo.incidentDirection'],
            'Incident_Status_Dtm': ['incidentStatusDtm', 'incidentInfo.incidentStatusDtm'],
            'Validity_period': ['validityPeriod'],
            'updatedAt': ['UpdatedAt', 'updated_at', 'Updated_At'],
            'Days_Count': ['daysCount', 'incidentInfo.daysCount'],
            'Drc_Commision_Rule': ['drcCommissionRule', 'incidentInfo.drcCommissionRule'],
            'BSS_Arrears_Amount': ['bssArrearsAmount', 'basicInfo.bssArrearsAmount'],
            'Monitor_Months': ['monitorMonths', 'basicInfo.monitorMonths'],
            'Commission': ['commission', 'basicInfo.commission'],
            'Case_Distribution_Batch_Id': ['caseDistributionBatchId', 'basicInfo.caseDistributionBatchId'],
            'Rejected_By': ['rejectedBy'],
            'Rejected_Dtm': ['rejectedDtm'],
            'File_Name_Dump': ['fileNameDump'],
            'File_Name_Rejected': ['fileNameRejected'],
            'Remark': ['remark', 'basicInfo.remark'],
            'Batch_Id_Tag_Dtm': ['batchIdTagDtm'],
            'Filtered_Reason': ['filteredReason', 'basicInfo.filteredReason'],
            'Batch_Id': ['batchId'],
            'DocVersion': ['docVersion'],
            'Doc_Version': ['docVersion']
        };
        
        const alternatives = alternativeFields[rawField] || [];
        for (const alt of alternatives) {
            let altValue = incidentData[alt];
            
            // Handle nested paths
            if (alt.includes('.')) {
                const pathParts = alt.split('.');
                altValue = incidentData;
                for (const part of pathParts) {
                    if (altValue && typeof altValue === 'object') {
                        altValue = altValue[part];
                    } else {
                        altValue = undefined;
                        break;
                    }
                }
            }
            
            if (altValue !== undefined && altValue !== null && altValue !== '' && altValue !== 'null' && altValue !== 'NULL') {
                return altValue;
            }
        }
        
        return '';
    };

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
                                    { label: 'Incident ID', value: getValue('incidentInfo.incidentId', 'Incident_Id') },
                                    { label: 'Created Dtm', value: formatDate(getValue('incidentInfo.createdDtm', 'Created_Dtm')) },
                                    { label: 'Days Count', value: getValue('incidentInfo.daysCount', 'Days_Count') },
                                    { label: 'Incident Status', value: getValue('incidentInfo.incidentStatus', 'Incident_Status') },
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
                                    { label: 'Direction', value: getValue('incidentInfo.incidentDirection', 'Incident_direction') },
                                    { label: 'Action', value: getValue('incidentInfo.action', 'Actions') },
                                    { label: 'Source Type', value: getValue('incidentInfo.sourceType', 'Source_Type') },
                                    { label: 'DRC Commission Rule', value: getValue('incidentInfo.drcCommissionRule', 'Drc_Commision_Rule') },
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
                {/* Contact Details - check API formatted data first */}
                {(incidentData.contactDetails && Array.isArray(incidentData.contactDetails) && incidentData.contactDetails.length > 0) ? (
                    <CollapsibleSection title="Contact Details" sectionKey="contactDetails">
                        {renderCard(
                            incidentData.contactDetails?.[currentIndices['contactDetails'] || 0] ||
                            incidentData.contactDetails,
                            "Contact Details"
                        )}
                    </CollapsibleSection>
                ) : (incidentData.Contact_Details && Array.isArray(incidentData.Contact_Details) && incidentData.Contact_Details.length > 0) ? (
                    <CollapsibleSection title="Contact Details" sectionKey="rawContactDetails">
                        {renderCard(incidentData.Contact_Details, "Contact Details")}
                    </CollapsibleSection>
                ) : null}

                {/* Product Details - check API formatted data first */}
                {(incidentData.productDetails && Array.isArray(incidentData.productDetails) && incidentData.productDetails.length > 0) ? (
                    <CollapsibleSection title="Product Details" sectionKey="productDetails">
                        {renderCard(
                            incidentData.productDetails?.[currentIndices['productDetails'] || 0] ||
                            incidentData.productDetails,
                            "Product Details"
                        )}
                    </CollapsibleSection>
                ) : (incidentData.Product_Details && Array.isArray(incidentData.Product_Details) && incidentData.Product_Details.length > 0) ? (
                    <CollapsibleSection title="Product Details" sectionKey="rawProductDetails">
                        {renderCard(incidentData.Product_Details, "Product Details")}
                    </CollapsibleSection>
                ) : null}

                {/* Customer Details - check API formatted data first */}
                {(incidentData.customerDetails && Object.keys(incidentData.customerDetails).length > 0) ? (
                    <CollapsibleSection title="Customer Details" sectionKey="customerDetails">
                        {renderCard(incidentData.customerDetails, "Customer Details")}
                    </CollapsibleSection>
                ) : (incidentData.Customer_Details && Object.keys(incidentData.Customer_Details).length > 0) ? (
                    <CollapsibleSection title="Customer Details" sectionKey="rawCustomerDetails">
                        {renderCard(incidentData.Customer_Details, "Customer Details")}
                    </CollapsibleSection>
                ) : null}

                {/* Account Details - check API formatted data first */}
                {(incidentData.accountDetails && Object.keys(incidentData.accountDetails).length > 0) ? (
                    <CollapsibleSection title="Account Details" sectionKey="accountDetails">
                        {renderCard(incidentData.accountDetails, "Account Details")}
                    </CollapsibleSection>
                ) : (incidentData.Account_Details && Object.keys(incidentData.Account_Details).length > 0) ? (
                    <CollapsibleSection title="Account Details" sectionKey="rawAccountDetails">
                        {renderCard(incidentData.Account_Details, "Account Details")}
                    </CollapsibleSection>
                ) : null}

                {/* Last Actions - check API formatted data first */}
                {(incidentData.lastActions && Array.isArray(incidentData.lastActions) && incidentData.lastActions.length > 0) ? (
                    <CollapsibleSection title="Last Actions" sectionKey="lastActions">
                        {renderCard(
                            incidentData.lastActions?.[currentIndices['lastActions'] || 0] ||
                            incidentData.lastActions,
                            "Last Actions"
                        )}
                    </CollapsibleSection>
                ) : (incidentData.Last_Actions && Array.isArray(incidentData.Last_Actions) && incidentData.Last_Actions.length > 0) ? (
                    <CollapsibleSection title="Last Actions" sectionKey="rawLastActions">
                        {renderCard(incidentData.Last_Actions, "Last Actions")}
                    </CollapsibleSection>
                ) : null}

                {/* Marketing Details - check API formatted data first */}
                {(incidentData.marketingDetails && Array.isArray(incidentData.marketingDetails) && incidentData.marketingDetails.length > 0) ? (
                    <CollapsibleSection title="Marketing Details" sectionKey="marketingDetails">
                        {renderCard(
                            incidentData.marketingDetails?.[currentIndices['marketingDetails'] || 0] ||
                            incidentData.marketingDetails,
                            "Marketing Details"
                        )}
                    </CollapsibleSection>
                ) : (incidentData.Marketing_Details && Array.isArray(incidentData.Marketing_Details) && incidentData.Marketing_Details.length > 0) ? (
                    <CollapsibleSection title="Marketing Details" sectionKey="rawMarketingDetails">
                        {renderCard(incidentData.Marketing_Details, "Marketing Details")}
                    </CollapsibleSection>
                ) : null}

                {/* DRC Info */}
                {incidentData.drcInfo && Array.isArray(incidentData.drcInfo) && incidentData.drcInfo.length > 0 && (
                    <CollapsibleSection title="DRC" sectionKey="drc">
                        {renderCard(incidentData.drcInfo[currentIndices['drc'] || 0], "DRC")}
                    </CollapsibleSection>
                )}

                {/* RO Negotiations */}
                {incidentData.roNegotiations && Array.isArray(incidentData.roNegotiations) && incidentData.roNegotiations.length > 0 && (
                    <CollapsibleSection title="RO Negotiations" sectionKey="roNegotiations">
                        {renderCard(incidentData.roNegotiations[currentIndices['roNegotiations'] || 0], "RO Negotiations")}
                    </CollapsibleSection>
                )}

                {/* RO CPE Collections */}
                {incidentData.roCpeCollections && Array.isArray(incidentData.roCpeCollections) && incidentData.roCpeCollections.length > 0 && (
                    <CollapsibleSection title="RO CPE Collections" sectionKey="roCpeCollections">
                        {renderCard(incidentData.roCpeCollections[currentIndices['roCpeCollections'] || 0], "RO CPE Collections")}
                    </CollapsibleSection>
                )}

                {/* RO Customer Updates */}
                {incidentData.roCustomerUpdates && Array.isArray(incidentData.roCustomerUpdates) && incidentData.roCustomerUpdates.length > 0 && (
                    <CollapsibleSection title="RO Edited Customer Details" sectionKey="roCustomerUpdates">
                        {renderCard(incidentData.roCustomerUpdates[currentIndices['roCustomerUpdates'] || 0], "RO Edited Customer Details")}
                    </CollapsibleSection>
                )}

                {/* Mediation Board */}
                {incidentData.mediationBoard && Array.isArray(incidentData.mediationBoard) && incidentData.mediationBoard.length > 0 && (
                    <CollapsibleSection title="Mediation Board" sectionKey="mediationBoard">
                        {renderCard(incidentData.mediationBoard[currentIndices['mediationBoard'] || 0], "Mediation Board")}
                    </CollapsibleSection>
                )}

                {/* Settlements */}
                {incidentData.settlements && Array.isArray(incidentData.settlements) && incidentData.settlements.length > 0 && (
                    <CollapsibleSection title="Settlements" sectionKey="settlements">
                        {renderCard(incidentData.settlements[currentIndices['settlements'] || 0], "Settlements")}
                    </CollapsibleSection>
                )}

                {/* Money Transactions */}
                {incidentData.payments && Array.isArray(incidentData.payments) && incidentData.payments.length > 0 && (
                    <CollapsibleSection title="Money Transactions" sectionKey="payments">
                        {renderCard(incidentData.payments[currentIndices['payments'] || 0], "Payments")}
                    </CollapsibleSection>
                )}

                {/* FTL LOD */}
                {incidentData.ftlLodLetterDetails && Array.isArray(incidentData.ftlLodLetterDetails) && incidentData.ftlLodLetterDetails.length > 0 && (
                    <CollapsibleSection title="FTL LOD" sectionKey="ftlLod">
                        {renderCard(incidentData.ftlLodLetterDetails[currentIndices['ftlLod'] || 0], "FTL LOD")}
                    </CollapsibleSection>
                )}

                {/* Remarks */}
                {incidentData.remark && Array.isArray(incidentData.remark) && incidentData.remark.length > 0 && (
                    <CollapsibleSection title="Remarks" sectionKey="remark">
                        {renderCard(incidentData.remark[currentIndices['remark'] || 0], "Remarks")}
                    </CollapsibleSection>
                )}

                {/* Show Remark as simple text if it's a string and has content */}
                {(incidentData.Remark && typeof incidentData.Remark === 'string' && incidentData.Remark.trim() !== '') && (
                    <CollapsibleSection title="Remark" sectionKey="remarkText">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-900">
                                {incidentData.Remark}
                            </div>
                        </div>
                    </CollapsibleSection>
                )}

                {/* Approvals */}
                {incidentData.approvals && Array.isArray(incidentData.approvals) && incidentData.approvals.length > 0 && (
                    <CollapsibleSection title="Approvals" sectionKey="approvals">
                        {renderCard(incidentData.approvals[currentIndices['approvals'] || 0], "Approvals")}
                    </CollapsibleSection>
                )}

                {/* Status History */}
                {incidentData.statusHistory && Array.isArray(incidentData.statusHistory) && incidentData.statusHistory.length > 0 && (
                    <CollapsibleSection title="Status History" sectionKey="statusHistory">
                        {renderCard(incidentData.statusHistory[currentIndices['statusHistory'] || 0], "Status History")}
                    </CollapsibleSection>
                )}

                {/* Actions Taken */}
                {incidentData.actionsTaken && Array.isArray(incidentData.actionsTaken) && incidentData.actionsTaken.length > 0 && (
                    <CollapsibleSection title="Actions Taken" sectionKey="actionsTaken">
                        {renderCard(incidentData.actionsTaken[currentIndices['actionsTaken'] || 0], "Actions Taken")}
                    </CollapsibleSection>
                )}

                {/* Documents */}
                {incidentData.documents && Array.isArray(incidentData.documents) && incidentData.documents.length > 0 && (
                    <CollapsibleSection title="Documents" sectionKey="documents">
                        {renderCard(incidentData.documents[currentIndices['documents'] || 0], "Documents")}
                    </CollapsibleSection>
                )}

                {/* Reference Products */}
                {incidentData.refProducts && Array.isArray(incidentData.refProducts) && incidentData.refProducts.length > 0 && (
                    <CollapsibleSection title="Reference Products" sectionKey="refProducts">
                        {renderCard(incidentData.refProducts[currentIndices['refProducts'] || 0], "Reference Products")}
                    </CollapsibleSection>
                )}

                {/* RO Requests */}
                {incidentData.roRequests && Array.isArray(incidentData.roRequests) && incidentData.roRequests.length > 0 && (
                    <CollapsibleSection title="RO Requests" sectionKey="roRequests">
                        {renderCard(incidentData.roRequests[currentIndices['roRequests'] || 0], "RO Requests")}
                    </CollapsibleSection>
                )}

                {/* Litigation Information */}
                {incidentData.litigationInfo && Array.isArray(incidentData.litigationInfo) && incidentData.litigationInfo.length > 0 && (
                    <CollapsibleSection title="Litigation Information" sectionKey="litigation">
                        {renderCard(incidentData.litigationInfo[currentIndices['litigation'] || 0], "Litigation Information")}
                    </CollapsibleSection>
                )}

                {/* LOD Final Reminder */}
                {incidentData.lodFinalReminder && Array.isArray(incidentData.lodFinalReminder) && incidentData.lodFinalReminder.length > 0 && (
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
