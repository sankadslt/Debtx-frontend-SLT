import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCaseDetails ,Create_Task_For_Download_Case_Details} from '../../services/case/CaseServices.js';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const CaseDetails = () => {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [currentIndices, setCurrentIndices] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const caseId = location.state?.CaseID ;


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
        const loadCaseDetails = async () => {
            try {
                const response = await fetchCaseDetails(caseId);

                if (response.success) {
                    setCaseData(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Failed to load case details',
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#d33"
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to load case details',
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#d33"
                });
            } finally {
                setLoading(false);
            }
        };

        loadCaseDetails();
    }, [caseId]);

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
            'drc': caseData?.drcInfo,
            'roNegotiations': caseData?.roNegotiations,
            'roCpeCollections': caseData?.roCpeCollections,
            'roCustomerUpdates': caseData?.roCustomerUpdates,
            'mediationBoard': caseData?.mediationBoard,
            'settlements': caseData?.settlements,
            'payments': caseData?.payments,
            'ftlLod': caseData?.ftlLodLetterDetails,
            'abnormalStop': caseData?.abnormal_stop,
            'remark': caseData?.remark,
            'approve': caseData?.approve,
            'caseStatus': caseData?.caseStatus,
            'refProducts': caseData?.refProducts,
            'roRequests': caseData?.roRequests,
            'litigation': caseData?.litigationInfo,
            'lodFinalReminder': caseData?.lodFinalReminder
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

    const renderRecoveryOfficers = (officers) => {
        if (!officers || officers.length === 0) {
            return <p className="text-gray-500">No recovery officers data available</p>;
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {officers.map((officer, index) => (
                        <div key={`officer-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <h4 className="font-medium text-sm mb-3 text-gray-800">Officer {officer.ro_id}</h4>
                            <div className="space-y-2">
                                {[
                                    { label: 'ro_id', value: officer.ro_id },
                                    { label: 'Assigned By', value: officer.assigned_by || '' },
                                    { label: 'Assigned Date', value: formatDate(officer.assigned_dtm) },
                                    { label: 'Removed Date', value: formatDate(officer.removed_dtm) },
                                    { label: 'Removal Remark', value: officer.case_removal_remark || '' }
                                ].map((item, i) => (
                                    <div key={`officer-detail-${i}`} className="flex justify-between">
                                        <span className="text-sm text-gray-600">{item.label}:</span>
                                        <span className="text-sm font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCard = (data, title) => {
        if (!data) return <p className="text-gray-500">No data available</p>;

        if (title === "DRC" && data.recoveryOfficers) {
            return (
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(data)
                                .filter(([key]) => key !== 'recoveryOfficers')
                                .map(([key, value]) => (
                                    <div key={key} className="flex flex-col space-y-1">
                                        <label className="text-sm font-medium text-gray-600">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                        </label>
                                        <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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

                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">Recovery Officers</h3>
                        {renderRecoveryOfficers(data.recoveryOfficers)}
                    </div>
                </div>
            );
        }

        // Special handling for FTL LOD data
        if (title === "FTL LOD") {
            return (
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(data)
                                .filter(([key]) => !['ftlLodLetterDetails', 'relatedDocuments'].includes(key))
                                .map(([key, value]) => (
                                    <div key={key} className="flex flex-col space-y-1">
                                        <label className="text-sm font-medium text-gray-600">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                        </label>
                                        <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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

                    {data.ftlLodLetterDetails && data.ftlLodLetterDetails.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">LOD Letter Details</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {data.ftlLodLetterDetails.map((detail, index) => (
                                    <div key={`lod-detail-${index}`} className="mb-4 last:mb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(detail).map(([key, value]) => (
                                                <div key={key} className="flex flex-col space-y-1">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                    </label>
                                                    <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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
                                ))}
                            </div>
                        </div>
                    )}

                    {data.relatedDocuments && data.relatedDocuments.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">Customer Responses</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {data.relatedDocuments.map((response, index) => (
                                    <div key={`response-${index}`} className="mb-4 last:mb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(response).map(([key, value]) => (
                                                <div key={key} className="flex flex-col space-y-1">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                    </label>
                                                    <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Special handling for Litigation data
        if (title === "Litigation Information") {
            return (
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(data)
                                .filter(([key]) => !['supportDocuments', 'hsFilesInformation', 'legalSubmission', 'legalDetails'].includes(key))
                                .map(([key, value]) => (
                                    <div key={key} className="flex flex-col space-y-1">
                                        <label className="text-sm font-medium text-gray-600">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                        </label>
                                        <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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

                    {data.supportDocuments && data.supportDocuments.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">Support Documents</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {data.supportDocuments.map((doc, index) => (
                                    <div key={`support-doc-${index}`} className="mb-4 last:mb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(doc).map(([key, value]) => (
                                                <div key={key} className="flex flex-col space-y-1">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                    </label>
                                                    <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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
                                ))}
                            </div>
                        </div>
                    )}

                    {data.hsFilesInformation && data.hsFilesInformation.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">HS Files Information</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {data.hsFilesInformation.map((file, index) => (
                                    <div key={`hs-file-${index}`} className="mb-4 last:mb-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(file).map(([key, value]) => (
                                                <div key={key} className="flex flex-col space-y-1">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                    </label>
                                                    <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Default card rendering
        return (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-600">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </label>
                            <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
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

    const renderBasicInfoCard = (basicInfo) => {
        if (!basicInfo) return null;

        const infoFields = [
             [
                { label: 'Account No', value: basicInfo.accountNo || '' },
                { label: 'Customer Ref', value: basicInfo.customerRef || '' },
                { label: 'Incident ID', value: basicInfo.incidentId || '' },
 
                { label: 'Customer Name', value: basicInfo.customerName || '' },
                { label: 'Customer Type', value: basicInfo.customerType || '' },
                { label: 'Arrears Band', value: basicInfo.arrearsBand || '' },
                 
                
              ],
              
               [
                { label: 'Rtom', value: basicInfo.rtom || '' },
                { label: 'Arrears Amount', value: basicInfo.arrearsAmount || '' },
                { label: 'Action Type', value: basicInfo.actionType || '' },
                { label: 'Area', value: basicInfo.area || '' },
                { label: 'Implemented Dtm', value: formatDate(basicInfo.implementedDtm) },
                { label: 'Account Manager Code', value: basicInfo.accountManagerCode || '' },
                
               
              ],
            [
              { label: 'DRC Commission Rule', value: basicInfo.drcCommissionRule || '' },
              { label: 'Monitor Months', value: basicInfo.monitorMonths || '' },
              { label: 'Commission', value: caseData.basicInfo.commission || '' },
              { label: 'Case Distribution Batch ID', value: caseData.basicInfo.caseDistributionBatchId || '' },
              { label: 'Filtered Reason', value: caseData.basicInfo.filteredReason || '' },
              { label: 'BSS Arrears Amount', value: caseData.basicInfo.bssArrearsAmount || '' },
               ],
              [
                { label: 'Current Status', value: caseData.caseInfo.currentStatus || '' },
                { label: 'Last Payment Date', value: formatDate(caseData.basicInfo.lastPaymentDate) },
                { label: 'Last BSS Reading Date', value: formatDate(caseData.basicInfo.lastBssReadingDate) },
                { label: 'Remark', value: caseData.basicInfo.remark || '' },
                { label: 'Region', value: basicInfo.region || '' },
                
              ],
              
        ];

                return (
            // <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
            <div className={`${GlobalStyle.cardContainer}p-6 mb-8`}>

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

                {(basicInfo.remark || basicInfo.remarks) && (
                    <div className="flex flex-col mt-4">
                        <span className="text-sm font-semibold text-gray-700 mb-2">Remark:</span>
                        <div className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded border min-h-[60px]">
                            {basicInfo.remark || basicInfo.remarks || 'No remarks available'}
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
            const response = await Create_Task_For_Download_Case_Details(userData);
            if(response==="success"){
                Swal.fire({
                    title:response,
                    text:'Task created successfully!',
                    icon:"success",
                    confirmButtonColor:"#28a745"
                });
            }
        } catch(error){
            Swal.fire({
                title:"Error",
                text:error.message || "Failed to create task.",
                icon:"error",
                confirmButtonColor:"#d33"
            });
        
        }finally{
            setIsCreatingTask(false)
        }
            };
        
    

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="font-sans p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-600">No case data found</div>
            </div>
        );
    }

    return (
        <div className="font-sans p-6 min-h-screen relative">
            <div className="relative z-10 mb-8">
                <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Case Details</h1>

                    <div className="bg-white rounded-lg shadow-md p-6 min-w-64">
  <div className="grid grid-cols-2 gap-x-8">
    {/* Left column: first 4 items */}
    <div className="space-y-2">
      {[
        { label: 'Case ID', value: caseData.caseInfo.caseId },
        { label: 'Created dtm', value: formatDate(caseData.caseInfo.createdDtm) },
        { label: 'Days count', value: caseData.caseInfo.daysCount },
        { label: 'Current Arrears Band', value: caseData.caseInfo.currentArrearsBand },
      ].map((item, index) => (
        <div key={`left-case-info-${index}`} className="flex justify-between">
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
        { label: 'Proceed DTM', value: formatDate(caseData.caseInfo.proceedDtm) },
        { label: 'Proceed By', value: caseData.caseInfo.ProceedBy },
        { label: 'Current Status', value: caseData.caseInfo.currentStatus },
        { label: 'Current Phase', value: caseData.caseInfo.caseCurrentPhase },
      ].map((item, index) => (
        <div key={`right-case-info-${index}`} className="flex justify-between">
          <span className="text-sm text-gray-600">{item.label}:</span>
          <span className="text-sm text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
</div>

                </div>
            </div>

            {renderBasicInfoCard(caseData.basicInfo)}

            <div className="space-y-2 mb-8">
                {caseData.drcInfo && (
                    <CollapsibleSection title="DRC" sectionKey="drc">
                        {renderCard(caseData.drcInfo[currentIndices['drc'] || 0], "DRC")}
                    </CollapsibleSection>
                )}

                {caseData.roNegotiations && (
                    <CollapsibleSection title="RO Negotiations" sectionKey="roNegotiations">
                        {renderCard(caseData.roNegotiations[currentIndices['roNegotiations'] || 0], "RO Negotiations")}
                    </CollapsibleSection>
                )}

                {caseData.roCpeCollections && (
                    <CollapsibleSection title="RO CPE Collections" sectionKey="roCpeCollections">
                        {renderCard(caseData.roCpeCollections[currentIndices['roCpeCollections'] || 0], "RO CPE Collections")}
                    </CollapsibleSection>
                )}

                {caseData.roCustomerUpdates && (
                    <CollapsibleSection title="Ro Edited Customer Details" sectionKey="roCustomerUpdates">
                        {renderCard(caseData.roCustomerUpdates[currentIndices['roCustomerUpdates'] || 0], "Ro Edited Customer Details")}
                    </CollapsibleSection>
                )}

                {caseData.mediationBoard && (
                    <CollapsibleSection title="Mediation Board" sectionKey="mediationBoard">
                        {renderCard(caseData.mediationBoard[currentIndices['mediationBoard'] || 0], "Mediation Board")}
                    </CollapsibleSection>
                )}

                {caseData.settlements && (
                    <CollapsibleSection title="Settlements" sectionKey="settlements">
                        {renderCard(caseData.settlements[currentIndices['settlements'] || 0], "Settlements")}
                    </CollapsibleSection>
                )}

                {caseData.payments && (
                    <CollapsibleSection title="Money Transactions" sectionKey="payments">
                        {renderCard(caseData.payments[currentIndices['payments'] || 0], "Payments")}
                    </CollapsibleSection>
                )}

                {caseData.ftlLodLetterDetails && (
                    <CollapsibleSection title="FTL LOD" sectionKey="ftlLod">
                        {renderCard(caseData.ftlLodLetterDetails[currentIndices['ftlLod'] || 0], "FTL LOD")}
                    </CollapsibleSection>
                )}

                {caseData.abnormal_stop && (
                    <CollapsibleSection title="Abnormal Stop" sectionKey="abnormalStop">
                        {renderCard(caseData.abnormal_stop[currentIndices['abnormalStop'] || 0], "Abnormal Stop")}
                    </CollapsibleSection>
                )}

                {caseData.remark && (
                    <CollapsibleSection title="Remarks" sectionKey="remark">
                        {renderCard(caseData.remark[currentIndices['remark'] || 0], "Remarks")}
                    </CollapsibleSection>
                )}

                {caseData.approve && (
                    <CollapsibleSection title="Approvals" sectionKey="approve">
                        {renderCard(caseData.approve[currentIndices['approve'] || 0], "Approvals")}
                    </CollapsibleSection>
                )}

                {caseData.caseStatus && (
                    <CollapsibleSection title="Case Status" sectionKey="caseStatus">
                        {renderCard(caseData.caseStatus[currentIndices['caseStatus'] || 0], "Case Status")}
                    </CollapsibleSection>
                )}

                {caseData.refProducts && (
                    <CollapsibleSection title="Reference Products" sectionKey="refProducts">
                        {renderCard(caseData.refProducts[currentIndices['refProducts'] || 0], "Reference Products")}
                    </CollapsibleSection>
                )}

                {caseData.roRequests && (
                    <CollapsibleSection title="RO Requests" sectionKey="roRequests">
                        {renderCard(caseData.roRequests[currentIndices['roRequests'] || 0], "RO Requests")}
                    </CollapsibleSection>
                )}

                {caseData.litigationInfo && (
                    <CollapsibleSection title="Litigation Information" sectionKey="litigation">
                        {renderCard(caseData.litigationInfo[currentIndices['litigation'] || 0], "Litigation Information")}
                    </CollapsibleSection>
                )}

                {caseData.lodFinalReminder && (
                    <CollapsibleSection title="LOD Final Reminder" sectionKey="lodFinalReminder">
                        {renderCard(caseData.lodFinalReminder[currentIndices['lodFinalReminder'] || 0], "LOD Final Reminder")}
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
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default CaseDetails;
 