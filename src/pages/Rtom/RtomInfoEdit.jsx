import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { fetchRTOMDetails, updateRTOMDetails } from "../../services/RTOM/RtomService";
import Swal from "sweetalert2";
import { getLoggedUserId } from "../../services/auth/authService";


const RtomInfoEdit = () => {
  const { rtomId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    billingCenterCode: "",
    name: "",
    areaCode: "",
    email: "",
    mobile: "",
    telephone: "",
    status: "Active"
  });
  const [isEnabled, setIsEnabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [logHistory, setLogHistory] = useState([]);
  const [userData, setUserData] = useState(null);

  const goBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    const loadRTOMDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRTOMDetails(rtomId);
        
        const mobile = response.rtom_mobile_no?.[0]?.mobile_number 
          ? String(response.rtom_mobile_no[0].mobile_number).padStart(10, '0') 
          : "";
        const telephone = response.rtom_telephone_no?.[0]?.telephone_number 
          ? String(response.rtom_telephone_no[0].telephone_number).padStart(10, '0') 
          : "";
        
        setFormData({
          billingCenterCode: response.billing_center_code,
          name: response.rtom_name,
          areaCode: response.area_code,
          email: response.rtom_email,
          mobile: mobile,
          telephone: telephone,
          status: response.rtom_status
        });
        setIsEnabled(response.rtom_status === "Active");
        
        if (response.rtom_remarks) {
          setLogHistory(response.rtom_remarks.map(remark => ({
            editOn: remark.remark_date,
            action: remark.remark || "Details updated",
            editBy: remark.remark_by || "System"
          })));
        }
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


  // get system user 
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);


  

  const handleStatusChange = (enabled) => {
    setIsEnabled(enabled);
    setFormData(prev => ({
      ...prev,
      status: enabled ? "Active" : "Inactive"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let remarkBy = userData ? userData.id || userData.userId || userData : "system";

    if (!remark.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Remark Required",
          text: "Please enter a remark before submitting.",
        });
        return; 
      }
    
    try {
      const updatedData = {
        rtom_id: rtomId,
        billing_center_code: formData.billingCenterCode,
        rtom_name: formData.name,
        area_code: formData.areaCode,
        rtom_email: formData.email,
        rtom_mobile_no: formData.mobile,
        rtom_telephone_no: formData.telephone,
        rtom_status: formData.status,
        remark: remark,
        updated_by: userData?.user_id
      };

      const response = await updateRTOMDetails(updatedData);
      console.log("Update response:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "RTOM details updated successfully!",
      }).then(() => {
        navigate(-1);
      });
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update RTOM details",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  };

  const rowsPerPage = 7;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>
        {formData.billingCenterCode} - {formData.name} RTOM Area
      </h1>

      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} mt-4 w-full max-w-2xl relative`}>
          <div className="absolute top-4 right-4 ml-8">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={(e) => handleStatusChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
            {/* Billing Center Code */}
            <div className="flex gap-8 items-center">
              <h1 className="w-48">Billing Center Code</h1>
              <span>:</span>
              <input
                name="billingCenterCode"
                type="text"
                className={GlobalStyle.inputText}
                value={formData.billingCenterCode}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Name */}
            <div className="flex gap-8 items-center">
              <h1 className="w-48">Name</h1>
              <span>:</span>
              <input
                name="name"
                type="text"
                className={GlobalStyle.inputText}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Area Code */}
            <div className="flex gap-8 items-center">
              <h1 className="w-48">Area Code</h1>
              <span>:</span>
              <input
                name="areaCode"
                type="text"
                className={GlobalStyle.inputText}
                value={formData.areaCode}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="flex gap-8 items-center">
              <h1 className="w-48">Email</h1>
              <span>:</span>
              <input
                name="email"
                type="email"
                className={GlobalStyle.inputText}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <strong className="block pt-4 underline">Contact Details</strong>

            <div className="flex gap-8 items-center ml-16">
              <h1 className="w-48">Mobile</h1>
              <span>:</span>
              <input
                name="mobile"
                type="tel"
                className={GlobalStyle.inputText}
                value={formData.mobile}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                title="10 digit mobile number"
              />
            </div>

            <div className="flex gap-8 items-center ml-16">
              <h1 className="w-48">Telephone</h1>
              <span>:</span>
              <input
                name="telephone"
                type="tel"
                className={GlobalStyle.inputText}
                value={formData.telephone}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                title="10 digit telephone number"
              />
            </div>

            <div className="mb-6">
              <label className={GlobalStyle.remarkTopic}>Remark</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className={`${GlobalStyle.remark} w-[467px] ml-10`}
                rows="5"
                placeholder=" "
              ></textarea>
            </div>

            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                className={`${GlobalStyle.buttonPrimary} px-8 py-2`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col items-start mb-4">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setShowPopup(true)}
        >
          Log History
        </button>

        <div style={{ marginTop: '12px' }}>
          <button className={GlobalStyle.navButton} onClick={goBack}>
            <FaArrowLeft />  Back
          </button>
        </div>
      </div>

      {/* Log History Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
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
                 <input  type="text"
                  placeholder=""
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className={GlobalStyle.inputSearch}  />
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
                          <td className={GlobalStyle.tableData}>{formatDate(row.editOn)}</td>
                          <td className={GlobalStyle.tableData}>{row.action}</td>
                          <td className={GlobalStyle.tableData}>{row.editBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
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

export default RtomInfoEdit;
