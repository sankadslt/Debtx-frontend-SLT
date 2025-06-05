import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCaseDetails } from '../../services/case/CaseServices.js';  
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useLocation, useNavigate } from 'react-router-dom';
 
 
const CaseDetails = () => {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [currentIndices, setCurrentIndices] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    
    const caseId = location.state?.CaseID || null; // Get caseId from state or URL params

    useEffect(() => {
        const loadCaseDetails = async () => {
            try {
               // const token = localStorage.getItem("accessToken");
                const response = await fetchCaseDetails(caseId);
                
                if (response.success) {
                    setCaseData(response.data);
                } else {
                    setError(response.message || 'Failed to load case details');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching case details');
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
            'roNegotiateArrears': caseData?.roNegotiations,
            'roCpeCollections': caseData?.roCpeCollections,
            'roNegotiateCPE': caseData?.ro_negotiatepecollections,
            'roCustomerUpdated': caseData?.roCustomerUpdates,
            'mediationBoard': caseData?.mediationBoard,
            'settlement': caseData?.settlements,
            'payment': caseData?.payments,
            'lod': caseData?.lod,
            'abnormal_stop': caseData?.abnormal_stop
        };
        return sectionMap[sectionKey];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString("en-GB")|| "";
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
                                    { label: 'Assigned By', value: officer.assigned_by || 'N/A' },
                                    { label: 'Assigned Date', value: formatDate(officer.assigned_dtm) },
                                    { label: 'Removed Date', value: formatDate(officer.removed_dtm) },
                                    { label: 'Removal Remark', value: officer.case_removal_remark || 'N/A' }
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
                                                    ? 'N/A'
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
                                        ? 'N/A'
                                        : value.toString())}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderReferenceDataCard = (data, currentIndex) => {
        if (!data) return <p className="text-gray-500">No data available</p>;

        const sections = [];
        if (data.products?.length > 0) sections.push({ title: 'Products', data: data.products });
        if (data.contacts?.length > 0) sections.push({ title: 'Contacts', data: data.contacts });

        if (sections.length === 0) return <p className="text-gray-500">No data available</p>;

        const currentSection = sections[currentIndex % sections.length];
        const currentItem = currentSection.data[Math.floor(currentIndex / sections.length)] || currentSection.data[0];

        return (
            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800">{currentSection.title}</h4>
                {renderCard(currentItem, currentSection.title)}
            </div>
        );
    };

    const renderBasicInfoCard = (basicInfo) => {
        if (!basicInfo) return null;
      
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
        };
      
        const getValue = (...fields) => {
          for (const field of fields) {
            if (field && field !== '') return field;
          }
          return 'N/A';
        };
      
        return (
          <div className=" p-1 mb-6">
            <div className="max-w-8xl mx-auto flex flex-wrap justify-between">
              {/* Left column */}
              <div className="w-full sm:w-[auto]  space-y-3 width-50 ">
                {[
                  { label: 'Account No', value: getValue(basicInfo.accountNo, basicInfo.account_no) },
                  { label: 'Customer Ref', value: getValue(basicInfo.customerRef, basicInfo.customer_ref) },
                  {
                    label: 'Area',
                    custom: (
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded border w-24">
                          {getValue(basicInfo.area, basicInfo.area_name)}
                        </div>
                        <span className="font-bold text-sm w-16 text-center">RTOM</span>
                        <div className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded border w-24">
                          {getValue(basicInfo.rtom, basicInfo.rtom_name)}
                        </div>
                      </div>
                    ),
                  },
                  { label: 'Arrears amount', value: getValue(basicInfo.arrearsAmount, basicInfo.arrears_amount) },
                  { label: 'Action type', value: getValue(basicInfo.actionType, basicInfo.action_type) },
                  { label: 'Remark', value: getValue(basicInfo.remark, basicInfo.remark_text) },
                ].map(({ label, value, custom }, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="font-bold text-sm w-28">{label}</span>
                    {custom || (
                      <div className="text-sm text-gray-900 flex-1 bg-gray-50 px-3 py-1.5 rounded border">
                        {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
      
              {/* Right column */}
              <div className="w-full sm:w-1/2 space-y-3 mt-6 sm:mt-0">
                {[
                  { label: 'Created dtm', value: formatDate(getValue(basicInfo.createdDtm, basicInfo.created_dtm)) },
                  { label: 'Days count', value: getValue(basicInfo.daysCount, basicInfo.days_count) },
                  { label: 'Current status', value: getValue(basicInfo.currentStatus, basicInfo.current_status) },
                  { label: 'Last payment date', value: formatDate(getValue(basicInfo.lastPaymentDate, basicInfo.last_payment_date)) },
                  { label: 'Last BSS Reading date', value: formatDate(getValue(basicInfo.lastBSSReadingDate, basicInfo.last_bss_reading_date)) },
                ].map(({ label, value }, index) => (
                  <div key={index} className="flex items-center space-x-4 justify-end">
                    <span className="font-bold text-sm w-40 text-right">{label}</span>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded border w-48">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      };
      

    const CollapsibleSection = ({ title, children, sectionKey }) => {
        const isOpen = openSections[sectionKey];
        const currentIndex = currentIndices[sectionKey] || 0;
        const sectionData = getSectionData(sectionKey);
        
        let totalItems = 0;
        if (sectionKey === 'referenceData' && sectionData) {
            totalItems = (sectionData.products?.length || 0) + (sectionData.contacts?.length || 0);
        } else if (Array.isArray(sectionData)) {
            totalItems = sectionData.length;
        }

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

    const handleDownloadClick = () => {
       
    };

    if (loading) {
        return (
            <div className="font-sans p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading case details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="font-sans p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-red-600">Error: {error}</div>
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
                        <div className="space-y-2">
                            {[
                                { label: 'Case ID', value: caseData.caseInfo.caseId },
                                { label: 'Created dtm', value: new Date(caseData.caseInfo.createdDtm).toLocaleDateString() },
                                { label: 'Days count', value: caseData.caseInfo.daysCount }
                            ].map((item, index) => (
                                <div key={`case-info-${index}`} className="flex justify-between">
                                    <span className="text-sm text-gray-600">{item.label}:</span>
                                    <span className={`text-sm ${index === 0 ? 'font-bold' : ''} text-gray-900`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {renderBasicInfoCard(caseData.basicInfo)}

            <div className="space-y-2 mb-8">
                {caseData.referenceData && (
                    <CollapsibleSection title="Reference Data" sectionKey="referenceData">
                        {renderReferenceDataCard(caseData.referenceData, currentIndices['referenceData'] || 0,"Reference Data")}
                    </CollapsibleSection>
                )}

                {caseData.drcInfo && (
                    <CollapsibleSection title="DRC" sectionKey="drc">
                        {renderCard(caseData.drcInfo[currentIndices['drc'] || 0], "DRC")}
                    </CollapsibleSection>
                )}

                {caseData.roNegotiations && (
                    <CollapsibleSection title="RO - Negotiate | Arrears" sectionKey="roNegotiateArrears">
                        {renderCard(caseData.roNegotiations[currentIndices['roNegotiateArrears'] || 0], "RO Negotiations")}
                    </CollapsibleSection>
                )}

                {caseData.roCpeCollections && (
                    <CollapsibleSection title="RO - CPE Collections" sectionKey="roCpeCollections">
                        {renderCard(caseData.roCpeCollections[currentIndices['roCpeCollections'] || 0], "RO CPE Collections")}
                    </CollapsibleSection>
                )}

                {caseData.ro_negotiatepecollections && (
                    <CollapsibleSection title="RO - Negotiate & CPE Collections" sectionKey="roNegotiateCPE">
                        {renderCard(caseData.ro_negotiatepecollections[currentIndices['roNegotiateCPE'] || 0], "RO Negotiate CPE")}
                    </CollapsibleSection>
                )}

                {caseData.roCustomerUpdates && (
                    <CollapsibleSection title="RO - Customer Updated data" sectionKey="roCustomerUpdated">
                        {renderCard(caseData.roCustomerUpdates[currentIndices['roCustomerUpdated'] || 0], "RO Customer Updates")}
                    </CollapsibleSection>
                )}

                {caseData.mediationBoard && (
                    <CollapsibleSection title="Mediation Board" sectionKey="mediationBoard">
                        {renderCard(caseData.mediationBoard[currentIndices['mediationBoard'] || 0], "Mediation Board")}
                    </CollapsibleSection>
                )}

                {caseData.settlements && (
                    <CollapsibleSection title="Settlement" sectionKey="settlement">
                        {renderCard(caseData.settlements[currentIndices['settlement'] || 0], "Settlement")}
                    </CollapsibleSection>
                )}

                {caseData.abnormal_stop && (
                    <CollapsibleSection title="Abnormal Stop" sectionKey="abnormal_stop">
                        {renderCard(caseData.abnormal_stop[currentIndices['abnormal_stop'] || 0], "Abnormal Stop")}
                    </CollapsibleSection>
                )}

                {caseData.payments && (
                    <CollapsibleSection title="Payment" sectionKey="payment">
                        {renderCard(caseData.payments[currentIndices['payment'] || 0], "Payment")}
                    </CollapsibleSection>
                )}

             

                {caseData.lod && (
                    <CollapsibleSection title="LOD" sectionKey="lod">
                        {renderCard(caseData.lod[currentIndices['lod'] || 0], "LOD")}
                    </CollapsibleSection>
                )}
            </div>

            <div className="flex justify-between items-center">
  <button 
    className={`${GlobalStyle.navButton} p-3`}
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


