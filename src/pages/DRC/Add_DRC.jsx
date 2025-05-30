/*Purpose:
Created Date: 2025-03-20
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 2025-05-22
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
Version: React v18
ui number : 10.2
Dependencies: Tailwind CSS
Related Files:
Notes: This template uses Tailwind CSS */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import { getLoggedUserId } from "../../services/auth/authService";
import {
  getActiveServiceDetails,
  getActiveRTOMDetails,
  getSLTCoordinators,
  registerDRC,
} from "../../services/drc/Drc.js";

import addIcon from "../../assets/images/add.svg";
import iconImg from "../../assets/images/minorc.png";

const Add_DRC = () => {
  const navigate = useNavigate();
  
  const [DRCName, setDRCName] = useState("");
  const [BusinessRegistrationNo, setBusinessRegistrationNo] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [Address, setAddress] = useState("");
  const [Email, setEmail] = useState("");

  // SLT Coordinator details
  const [ServiceNo, setServiceNo] = useState("");
  const [C_Name, setCName] = useState("");
  const [C_Email, setCEmail] = useState("");
  const [coordinators, setCoordinators] = useState([]);
  const [coordinatorLoading, setCoordinatorLoading] = useState(true);

  // Service Types
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  // RTOM Areas
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [rtomAreas, setRtomAreas] = useState([]);
  const [rtomLoading, setRtomLoading] = useState(true);
  const [rtomDropdownClicked, setRtomDropdownClicked] = useState(false);

  const [errors, setErrors] = useState({});

  // Validate phone number for Sri Lankan numbers
  const isValidPhoneNumber = (phone) => {
    // Remove all spaces and hyphens for validation
    const cleanPhone = phone.replace(/[\s-]/g, "");

    // International format patterns (+94 followed by 9 digits, no leading 0)
    const internationalMobilePatterns = [
      /^\+947[0-9]\d{7}$/, // +947xxxxxxxx (mobile: +94 + 7X + 7 digits)
    ];

    const internationalLandlinePatterns = [
      /^\+94(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)[2-9]\d{6}$/, // +94 + area code + operator + 6 digits
    ];

    // Local format patterns (starting with 0, total 10 digits)
    const localMobilePatterns = [
      /^07[0-9]\d{7}$/, // 07xxxxxxxx (mobile: 0 + 7X + 7 digits)
    ];

    const localLandlinePatterns = [
      /^0(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)[2-9]\d{6}$/, // 0 + area code + operator + 6 digits
    ];

    // Alternative format without + sign but with 94
    const altInternationalMobilePatterns = [
      /^947[0-9]\d{7}$/, // 947xxxxxxxx (without + sign)
    ];

    const altInternationalLandlinePatterns = [
      /^94(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)[2-9]\d{6}$/, // 94 + area code + operator + 6 digits
    ];

    // Check all patterns
    const allPatterns = [
      ...internationalMobilePatterns,
      ...internationalLandlinePatterns,
      ...localMobilePatterns,
      ...localLandlinePatterns,
      ...altInternationalMobilePatterns,
      ...altInternationalLandlinePatterns,
    ];

    for (const pattern of allPatterns) {
      if (pattern.test(cleanPhone)) {
        return true;
      }
    }

    return false;
  };

  // Validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fetch active service types from the API
  const fetchActiveServices = async () => {
    try {
      setLoading(true);
      const response = await getActiveServiceDetails();
      console.log("API Response:", response);

      if (response && response.data) {
        const filtered = response.data.filter(
          (service) => service.service_status === "Active"
        );
        const formatted = filtered.map((service) => ({
          id: service.service_id,
          name: service.service_type,
          selected: false,
        }));

        setServiceTypes(formatted);
      }
    } catch (error) {
      console.error("Error loading service types:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load active service types.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRTOMData = async () => {
    try {
      setRtomLoading(true);
      const response = await getActiveRTOMDetails();
      console.log("RTOM API Response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        // Map the database fields correctly
        const formattedData = response.data.map((rtom) => ({
          // Use rtom_id for ID
          id: rtom.rtom_id || rtom._id,
          // Use rtom_name for both code and name since that's what you want to display
          code: rtom.rtom_id?.toString() || "",
          name: rtom.rtom_name || "",
          selected: false,
        }));

        console.log("Formatted RTOM data:", formattedData);
        setRtomAreas(formattedData);
      } else {
        console.error(
          "Failed to fetch RTOM data:",
          response?.message || "Unknown error"
        );
        setRtomAreas([]); // Set empty array on failure
      }
    } catch (error) {
      console.error("Error fetching RTOM data:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load RTOM areas.",
      });
      setRtomAreas([]); // Set empty array on error
    } finally {
      setRtomLoading(false);
    }
  };

  // Fetch SLT Coordinators
  const fetchSLTCoordinators = async () => {
    try {
      setCoordinatorLoading(true);
      const response = await getSLTCoordinators();
      console.log("SLT Coordinators Response:", response);

      if (response.status === "success" && response.data) {
        setCoordinators(response.data);
      } else {
        console.error(
          "Failed to fetch SLT Coordinators:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching SLT Coordinators:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load SLT Coordinators.",
      });
    } finally {
      setCoordinatorLoading(false);
    }
  };

  // Call it once when the component mounts
  useEffect(() => {
    fetchActiveServices();
    fetchRTOMData();
    fetchSLTCoordinators();
  }, []);

  const handleDropdownClick = () => {
    if (!dropdownClicked) {
      fetchActiveServices();
      setDropdownClicked(true);
    }
  };

  const handleRtomDropdownClick = () => {
    if (!rtomDropdownClicked) {
      fetchRTOMData();
      setRtomDropdownClicked(true);
    }
  };

  // Handle service number selection and auto-populate coordinator details
  const handleServiceNoChange = (e) => {
    const selectedServiceNo = e.target.value;
    setServiceNo(selectedServiceNo);

    // Find the coordinator with the selected service number
    const selectedCoordinator = coordinators.find(
      (coord) => coord.user_id === selectedServiceNo
    );

    if (selectedCoordinator) {
      setCName(selectedCoordinator.username);
      setCEmail(selectedCoordinator.email);
    } else {
      // Clear the fields if no coordinator is found
      setCName("");
      setCEmail("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!DRCName) newErrors.DRCName = "DRC Name is required.";
    if (!BusinessRegistrationNo)
      newErrors.BusinessRegistrationNo =
        "Business registration number is required.";
    if (!ContactNo) {
      newErrors.ContactNo = "Contact number is required.";
    } else if (!isValidPhoneNumber(ContactNo)) {
      newErrors.ContactNo =
        "Please enter a valid Sri Lankan phone number. Formats: 07xxxxxxxx (10 digits), +947xxxxxxxx (mobile), +94xxyyyyyyy (landline), 0xxyyyyyyy (landline).";
    }
    if (!Address) newErrors.Address = "Address is required.";
    if (!Email) {
      newErrors.Email = "Email is required.";
    } else if (!isValidEmail(Email)) {
      newErrors.Email = "Please enter a valid email address.";
    }

    if (!ServiceNo) newErrors.ServiceNo = "Service number is required.";
    if (!C_Name) newErrors.C_Name = "Coordinator Name is required.";
    if (!C_Email) {
      newErrors.C_Email = "Coordinator Email is required.";
    } else if (!isValidEmail(Email)) {
      newErrors.Email = "Only Gmail addresses are allowed.";
    }

    // Check if at least one service type is selected
    if (serviceTypes.filter((s) => s.selected).length === 0) {
      newErrors.serviceTypes = "At least one service type must be selected.";
    }

    // Check if at least one RTOM area is selected
    if (rtomAreas.filter((r) => r.selected).length === 0) {
      newErrors.rtomAreas = "At least one RTOM area must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddServiceType = () => {
    if (
      selectedServiceType &&
      !serviceTypes.some((t) => t.name === selectedServiceType && t.selected)
    ) {
      const updatedTypes = serviceTypes.map((item) =>
        item.name === selectedServiceType ? { ...item, selected: true } : item
      );
      setServiceTypes(updatedTypes);
      setSelectedServiceType("");
    }
  };

  const handleAddRTOM = () => {
    if (
      selectedRTOM &&
      !rtomAreas.some((a) => a.code === selectedRTOM && a.selected)
    ) {
      const updatedAreas = rtomAreas.map((item) =>
        item.code === selectedRTOM ? { ...item, selected: true } : item
      );
      setRtomAreas(updatedAreas);
      setSelectedRTOM("");
    }
  };

  const handleRemoveServiceType = (type) => {
    const updatedTypes = serviceTypes.map((item) =>
      item.name === type ? { ...item, selected: false } : item
    );
    setServiceTypes(updatedTypes);
  };

  const handleRemoveRTOM = (code) => {
    const updatedAreas = rtomAreas.map((item) =>
      item.code === code ? { ...item, selected: false } : item
    );
    setRtomAreas(updatedAreas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields and ensure valid input.",
      });
      return;
    }

    try {
      const user_id = await getLoggedUserId();

      // Format the selected services according to the API requirements
      const selectedServices = serviceTypes
        .filter((s) => s.selected)
        .map((s) => ({
          service_type: s.name,
          service_status: "Active",
          create_by: user_id,
          create_on:
            new Date().toISOString().split("T")[0] +
            " " +
            new Date().toTimeString().split(" ")[0],
          status_update_dtm: new Date().toISOString(),
          status_update_by: user_id,
        }));

      // Format the selected RTOMs according to the API requirements
      const selectedRTOMs = rtomAreas
        .filter((r) => r.selected)
        .map((r) => ({
          rtom_id: parseInt(r.id),
          rtom_name: r.name,
          rtom_status: "Active",
          rtom_billing_center_code: "DEFAULT", // Add a default value as required by API
          create_by: user_id,
          create_dtm: new Date().toISOString(),
          status_update_by: user_id,
          status_update_dtm: new Date().toISOString(),
        }));

      // Create the coordinator object according to the API requirements
      const coordinatorData = [
        {
          service_no: ServiceNo, // Make sure this is a string as per your schema
          slt_coordinator_name: C_Name,
          slt_coordinator_email: C_Email,
          coordinator_create_dtm: new Date().toISOString(),
          coordinator_create_by: user_id,
        },
      ];

      // Format the data according to the API requirements
      const drcData = {
        drc_name: DRCName,
        drc_business_registration_number: BusinessRegistrationNo,
        drc_address: Address,
        drc_contact_no: ContactNo,
        drc_email: Email,
        create_by: user_id,
        create_on: new Date().toISOString(), // Add this field which is required in your schema
        slt_coordinator: coordinatorData,
        services: selectedServices,
        rtom: selectedRTOMs,
      };

      console.log("Submitting DRC data:", JSON.stringify(drcData, null, 2));

      // Call the API to register the DRC
      const response = await registerDRC(drcData);

      console.log("API Response:", response);

      Swal.fire({
        icon: "success",
        title: "DRC Created Successfully!",
        text: `The Debt Recovery Company has been registered successfully. `,
        showConfirmButton: true,
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to DRC list page
          navigate('/pages/DRC/DRCList'); 
        }
      });

      // Reset form
      setDRCName("");
      setBusinessRegistrationNo("");
      setContactNo("");
      setAddress("");
      setEmail("");
      setServiceNo("");
      setCName("");
      setCEmail("");
      setSelectedServiceType("");
      setSelectedRTOM("");
      setServiceTypes(
        serviceTypes.map((item) => ({ ...item, selected: false }))
      );
      setRtomAreas(rtomAreas.map((item) => ({ ...item, selected: false })));
      setErrors({});
    } catch (error) {
      console.error("Error registering DRC:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to register DRC.",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        {" "}
        <h1 className={GlobalStyle.headingLarge}>
          Register Debt Recovery Company
        </h1>
        <form onSubmit={handleSubmit} className="w-full mt-6">
          <div className={`${GlobalStyle.cardContainer} mx-auto`}>
            <h2
              className={`${GlobalStyle.headingMedium} mb-4 text-center font-bold`}
            >
              <span className="underline">Company Details</span>
            </h2>
            <table className="w-full">
              <tbody>
                <tr className="mb-2">
                  <td className="w-1/3 text-right pr-2 align-center pb-2">
                    DRC Name :
                  </td>
                  <td className="w-2/3 pb-2">
                    <input
                      type="text"
                      value={DRCName}
                      onChange={(e) => setDRCName(e.target.value)}
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                    {errors.DRCName && (
                      <p className="text-red-500">{errors.DRCName}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center mt-5">
                    Business Registration No :
                  </td>
                  <td className="w-2/3 pb-2">
                    <input
                      type="text"
                      value={BusinessRegistrationNo}
                      onChange={(e) =>
                        setBusinessRegistrationNo(e.target.value)
                      }
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                    {errors.BusinessRegistrationNo && (
                      <p className="text-red-500">
                        {errors.BusinessRegistrationNo}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center mt-5">
                    Contact Number :
                  </td>
                  <td className="w-2/3 pb-2">
                    <input
                      type="tel"
                      value={ContactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder=""
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                    {errors.ContactNo && (
                      <p className="text-red-500">{errors.ContactNo}</p>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="w-1/3 text-right pr-2 align-center mt-5">
                    Address :
                  </td>
                  <td className="w-2/3 pb-2">
                    <input
                      type="text"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                    {errors.Address && (
                      <p className="text-red-500">{errors.Address}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center mt-5">
                    Email :
                  </td>
                  <td className="w-2/3">
                    <input
                      type="text"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                    {errors.Email && (
                      <p className="text-red-500">{errors.Email}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <h2
              className={`${GlobalStyle.headingMedium} mb-4 mt-8 text-center font-bold`}
            >
              <span className="underline">SLT Coordinator Details</span>
            </h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center">
                    Service No :
                  </td>
                  <td className="w-2/3 pb-2">
                    <select
                      value={ServiceNo}
                      onChange={handleServiceNoChange}
                      className={`${GlobalStyle.selectBox} w-full`}
                    >
                      <option value="">Select Service No</option>
                      {coordinatorLoading ? (
                        <option disabled>Loading...</option>
                      ) : (
                        coordinators.map((coordinator, index) => (
                          <option key={index} value={coordinator.user_id}>
                            {coordinator.user_id}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.ServiceNo && (
                      <p className="text-red-500">{errors.ServiceNo}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center">Name :</td>
                  <td className="w-2/3 pb-2">
                    <input
                      type="text"
                      value={C_Name}
                      readOnly
                      className={`${GlobalStyle.inputText} w-full bg-gray-100`}
                    />
                    {errors.C_Name && (
                      <p className="text-red-500">{errors.C_Name}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center">
                    Email :
                  </td>
                  <td className="w-2/3">
                    <input
                      type="text"
                      value={C_Email}
                      readOnly
                      className={`${GlobalStyle.inputText} w-full bg-gray-100 `}
                    />
                    {errors.C_Email && (
                      <p className="text-red-500">{errors.C_Email}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <h2
              className={`${GlobalStyle.headingMedium} mb-4 mt-8 text-center font-bold`}
            >
              <span className="underline">Service Types</span>
            </h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center">
                    Service Type :
                  </td>
                  <td className="w-2/3">
                    <div className="flex">
                      <select
                        onClick={handleDropdownClick}
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        className={`${GlobalStyle.selectBox} flex-grow mr-2`}
                      >
                        <option value="">Select Service Type</option>
                        {loading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          serviceTypes
                            .filter((service) => !service.selected)
                            .map((service) => (
                              <option key={service.id} value={service.name}>
                                {service.name}
                              </option>
                            ))
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddServiceType}
                        className={`${GlobalStyle.buttonCircle} ml-2`}
                      >
                        <img
                          src={addIcon}
                          alt="Add"
                          style={{ width: 20, height: 20 }}
                        />
                      </button>
                    </div>
                    {loading && (
                      <p className="text-gray-500 mt-1">
                        Loading service types...
                      </p>
                    )}
                    {errors.serviceTypes && (
                      <p className="text-red-500">{errors.serviceTypes}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <table className={`${GlobalStyle.tableContainer} w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>Service Type</th>
                    <th className={GlobalStyle.tableHeader}></th>
                  </tr>
                </thead>

                <tbody>
                  {serviceTypes.filter((type) => type.selected).length > 0 ? (
                    serviceTypes
                      .filter((type) => type.selected)
                      .map((type, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className={GlobalStyle.tableData}>{type.name}</td>
                          <td
                            className={`${GlobalStyle.tableData} text-center flex justify-center`}
                          >
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceType(type.name)}
                              className={`${GlobalStyle.buttonCircle} ml-2`}
                            >
                              <img
                                src={iconImg}
                                alt="Remove"
                                style={{ width: 20, height: 20 }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className={`${GlobalStyle.tableData} text-center`}
                      >
                        No service types selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2
              className={`${GlobalStyle.headingMedium} mb-4 mt-8 text-center font-bold`}
            >
              <span className="underline">RTOM Areas</span>
            </h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3 text-right pr-2 align-center">
                    RTOM Area :
                  </td>
                  <td className="w-2/3">
                    <div className="flex">
                      <select
                        onClick={handleRtomDropdownClick}
                        value={selectedRTOM}
                        onChange={(e) => setSelectedRTOM(e.target.value)}
                        className={`${GlobalStyle.selectBox} flex-grow mr-2`}
                      >
                        <option value="">Select RTOM Area</option>
                        {rtomLoading ? (
                          <option disabled>Loading...</option>
                        ) : rtomAreas.length === 0 ? (
                          <option disabled>No RTOM areas available</option>
                        ) : (
                          rtomAreas
                            .filter((area) => !area.selected)
                            .map((area) => (
                              <option key={area.id} value={area.code}>
                                {area.name}
                              </option>
                            ))
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddRTOM}
                        className={`${GlobalStyle.buttonCircle} ml-2`}
                        disabled={!selectedRTOM}
                      >
                        <img
                          src={addIcon}
                          alt="Add"
                          style={{ width: 20, height: 20 }}
                        />
                      </button>
                    </div>
                    {rtomLoading && (
                      <p className="text-gray-500 mt-1">
                        Loading RTOM areas...
                      </p>
                    )}
                    {errors.rtomAreas && (
                      <p className="text-red-500">{errors.rtomAreas}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <table className={`${GlobalStyle.tableContainer} w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>RTOM Name</th>
                    <th className={GlobalStyle.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {rtomAreas.filter((area) => area.selected).length > 0 ? (
                    rtomAreas
                      .filter((area) => area.selected)
                      .map((area, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className={GlobalStyle.tableData}>{area.name}</td>
                          <td
                            className={`${GlobalStyle.tableData} text-center flex justify-center`}
                          >
                            <button
                              type="button"
                              onClick={() => handleRemoveRTOM(area.code)}
                              className={`${GlobalStyle.buttonCircle} ml-2`}
                            >
                              <img
                                src={iconImg}
                                alt="Remove"
                                style={{ width: 20, height: 20 }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className={`${GlobalStyle.tableData} text-center`}
                      >
                        No RTOM areas selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" className={GlobalStyle.buttonPrimary}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_DRC;
