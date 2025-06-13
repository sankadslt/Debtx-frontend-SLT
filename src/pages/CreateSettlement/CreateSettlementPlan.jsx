/* Purpose: This template is used for the 1.A.12 - Assign DRC page.
Created Date: 2025-01-07
Created By: 
Last Modified Date: 2025-06-07
Modified By: chamithu
Version: node 20
ui number : 7.2
Dependencies: tailwind css
Related Files: (routes)
 */





import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import { Case_Details_Settlement_Phase ,  Create_Settlement_Plan} from "../../services/settlement/SettlementServices";

import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getLoggedUserId } from "/src/services/auth/authService.js";

export default function CreateSettlementPlan() {
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [calendarMonth, setCalendarMonth] = useState();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [phase, setPhase] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [visibleTables, setVisibleTables] = useState({}); 
  const [error, setError] = useState("");
  const [settlementCount, setSettlementCount] = useState(0);
  const [caseDetails, setCaseDetails] = useState([]);
  //const { caseId } = useParams(); // Get caseId from URL
  const [settlementdata, setSettlementdata] = useState([]);
   const toggleSettlementTable = (index) => {
    setVisibleTables((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const caseId = location.state?.case_Id;
  const PlanType  = location.state?.PlanType ;

  const drcid = location.state?.DRC;
  console.log("Case ID from URL:", caseId);
  console.log("Plan Type from URL:", PlanType);
  console.log("DRC from URL:", drcid);
  // const data = [
  //   {
  //     seqNo: "1",
  //     installmentSettleAmount: "30,000",
  //     planDate: "mm/dd/yyyy",
  //     installmentPaidAmount: "25000",
  //   },
  // ];
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const payload = { case_id: caseId  };
        console.log("Sending API request with payload:", payload);
        const response = await Case_Details_Settlement_Phase(payload);
        console.log("API Response:", response);
        console.log("Case details received:", response);
        setCaseDetails(response);
        setSettlementCount(response?.settlement_count);
        setSettlementdata(response?.settlement_plans || []);
      } catch (error) {
        console.error("Error fetching case details:", error);
        setCaseDetails([]);
      }
    };
    fetchCaseDetails();
  }, []);
  useEffect(() => {
    if (!calendarMonth || calendarMonth < 1) return;

    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const to = new Date(
      from.getFullYear(),
      from.getMonth() + Number(calendarMonth),
      0
    );

    setFromDate(from);
    setToDate(to);
    setError("");
  }, [calendarMonth]);

  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };


  const handlesubmit = async () => {
    if (!phase ){
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter the phase.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    if (!initialAmount)
    {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter the initial amount.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    if (!calendarMonth) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter the calendar month.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    if (!remark) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a remark.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    try {
       const userId = await getLoggedUserId();
       console.log("User ID:", userId);
      const payload = {
       created_by : userId,
       case_phase : phase,
       case_status : caseDetails?.case_current_status,
       settlement_type : PlanType, // currently goes as plan 1 ask about this
       settlement_amount : caseDetails?.current_arrears_amount, // should change this 
       drc_id : drcid,
       settlement_plan_received:[Number(initialAmount), Number(calendarMonth)], 
       case_id: caseId,
       remark: remark,
    }

    console.log("Payload for settlement plan submission:", payload);

   const response = await Create_Settlement_Plan(payload);
    console.log("Response from settlement plan submission:", response);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Settlement plan submitted successfully.",
      confirmButtonColor: "#28a745"
    });

    setCalendarMonth("");
    setInitialAmount("");
    setFromDate(null);
    setToDate(null);
    setRemark("");
    setPhase("");
    

  } catch (error) {
    Swal.fire({
      icon: "error",  
      title: "Error",
      text: error.message || "An error occurred while submitting the settlement plan.",
      confirmButtonColor: "#d33",
    });
    } 
   }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div>
        <h1 className={GlobalStyle.headingLarge}>Create Settlement</h1>
      </div>
      <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
        {/* Card Box */}
        <div className="flex items-center justify-center ">
        <div className={`${GlobalStyle.cardContainer} w-full max-w-lg`}>
          {/* <p className="flex gap-3 mb-2">
            <strong>Case ID : </strong>
            <div> {caseDetails?.case_id}</div>
          </p>
          <p className="mb-2">
            <strong>Customer Ref : </strong>
            {caseDetails?.customer_ref}
          </p>
          <p className="flex gap-3 mb-2">
            <strong>Account no : </strong>
            <div> {caseDetails?.account_no}</div>
          </p>
          <p className="mb-2">
            <strong>Arrears Amount : </strong>
            {caseDetails?.current_arrears_amount}
          </p>
          <p className="mb-2">
            <strong>Last Payment Date : </strong>
            
          </p> */}

          <table>
            <colgroup>
              <col  />
              <col style={{ width: "20px" }} />
              <col />
              
            </colgroup>
            <tbody>
              <tr>
                  <td className="py-2"><strong> Case ID  </strong></td>
                  <td className="py-2"><strong> : </strong> </td>
                  <td className="py-2"> {caseDetails?.case_id}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>Customer Ref </strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {caseDetails?.customer_ref}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>Account no</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {caseDetails?.account_no}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>Last Payment Date</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2">  {new Date(caseDetails?.last_payment_date).toLocaleDateString()}</td>
              </tr>

            </tbody>  

          </table>
        </div>
        </div>

        {/* Input Fields */}
        <div
          className={`${GlobalStyle.tableContainer}  bg-white bg-opacity-50 p-8 max-w-3xl mx-auto `}
        >
        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Phase:</h1>
          <input
            type="text"
            placeholder="Text here"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className={GlobalStyle.inputText}
          />
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Case Status:</h1>
          <div> {caseDetails?.case_current_status}</div>
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Settlement Count:</h1>
          <div> {caseDetails?.settlement_count}</div>
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Settlement plan:</h1>
          <input
            className={GlobalStyle.inputText}
            value={PlanType}
            // onChange={(e) => setSelectedPlan(e.target.value)}
            readOnly
            style={{color: "black"}}
          > 

            {/* <option value="" hidden>
              Select plan
            </option>
            <option value="plan1">Plan 1</option>
            <option value="plan2">Plan 2</option> */}
          </input>
        </div>
        <br />

        {PlanType === "Type A" && (
          <>
            <div className="flex gap-4 mt-4">
              <h1 className={GlobalStyle.remarkTopic}>Initial Amount:</h1>
              <input
                type="text"
                placeholder="Enter Amount"
                className={GlobalStyle.inputText}
                value={initialAmount}
                 onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setInitialAmount(value);
                  }
                }}
              />
            </div>
            <br />

            <div className="mb-6 flex items-center gap-3">
              <label className={GlobalStyle.remarkTopic}>Calendar month:</label>
              <input
                type="number"
                className={`${GlobalStyle.inputText}`}
                min="1"
                max="12"
                onChange={(e) => setCalendarMonth(e.target.value)}
                value={calendarMonth}
                 onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            <div className="flex  flex-col sm:flex-row items-start gap-4">
               <label className={`${GlobalStyle.remarkTopic} `}>Duration:</label>
              {/* <h1 className={GlobalStyle.remarkTopic}>Duration:</h1> */}
          
            {/* <div className={GlobalStyle.datePickerContainer}> */}
             <div className="flex flex-wrap items-center gap-4 ">
              <label className={GlobalStyle.remarkTopic}>From:</label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
                readOnly
              />
              <label className={GlobalStyle.remarkTopic}>To:</label>
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
                readOnly
              />
            </div>
            </div>
            <br />

           <div className="flex  flex-col sm:flex-row items-start gap-4">
              <label className={GlobalStyle.remarkTopic}>Remark : </label>
              <textarea className={`${GlobalStyle.remark}`} rows="5"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              ></textarea>
            </div>
            <br />

            {/* Dynamically Render Tables Based on Settlement Count */}
            {/* {caseDetails?.settlement_plans?.map((plan, index) => (
              <div
                key={plan.settlement_id}
                className={GlobalStyle.tableContainer}
              >
                <h2 className={GlobalStyle.remarkTopic}>
                  Settlement ID: {plan.settlement_id}
                </h2>
                <div>
                  {/* Table */}
                  {/* <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                      <thead className={GlobalStyle.thead}>
                        <tr>
                          <th className={GlobalStyle.tableHeader}>SeqNo</th>
                          <th className={GlobalStyle.tableHeader}>
                            Installment Settle Amount
                          </th>
                          <th className={GlobalStyle.tableHeader}>Plan Date</th>
                          <th className={GlobalStyle.tableHeader}>
                            Installment Paid Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.settlement_plan.map((row, rowIndex) => (
                          <tr
                            key={row._id}
                            className={
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className={GlobalStyle.tableData}>
                              {row.installment_seq}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {row.Installment_Settle_Amount}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {new Date(row.Plan_Date).toLocaleDateString()}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {row.Installment_Paid_Amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}
              {/* </div> */}
            {/* ))}
            <br /> */}

            <div className="flex gap-4 justify-end">
              <button className={GlobalStyle.buttonPrimary}
                onClick={handlesubmit}
              >Submit</button>
            </div>
          </>
        )}
      </div>
      <br />
      <div className="mt-6">
          {settlementdata?.map((settlement, index) => (
            <div key={index} className="mb-4">
              <button
                type="button"
                onClick={() => toggleSettlementTable(index)}
                className={`${GlobalStyle.buttonSecondary} bg-[rgb(56,75,92)] text-white p-2 flex items-center justify-between w-full`}
                aria-label={`Toggle settlement ${index + 1} details`}
              >
                <span>{`Settlement ${index + 1}`}</span>
                <span>{visibleTables[index] ? "▲" : "▼"}</span>
              </button>

          { visibleTables[index] && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Seq. No
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Settle Amount
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Plan Date
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Paid Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlement.settlement_plan?.map((installment, i) => (
                      <tr key={i} className="bg-white bg-opacity-75 border-b">
                        <td className={GlobalStyle.tableData}>{installment.installment_seq}</td>
                        <td className={GlobalStyle.tableCurrency}>{installment.Installment_Settle_Amount}</td>
                        <td className={GlobalStyle.tableData}>{new Date (installment.Plan_Date).toLocaleDateString("en-GB")}</td>
                        <td className={GlobalStyle.tableCurrency}>{installment.Installment_Paid_Amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
          ))}
        </div>

      {/* { caseDetails?.setSettlementCount && (
        <div className="mt-6">
          {settlementdata?.map((settlement, index) => (
            <div key={index} className="mb-4">
              <button
                type="button"
                onClick={() => toggleSettlementTable(index)}
                className={`${GlobalStyle.buttonSecondary} bg-[rgb(56,75,92)] text-white p-2 flex items-center justify-between w-full`}
                aria-label={`Toggle settlement ${index + 1} details`}
              >
                <span>{`Settlement ${index + 1}`}</span>
                <span>{visibleTables[index] ? "▲" : "▼"}</span>
              </button>

          { visibleTables[index] && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Seq. No
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Settle Amount
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Plan Date
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Paid Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlement.settlement_plan?.map((installment, i) => (
                      <tr key={i} className="bg-white bg-opacity-75 border-b">
                        <td className={GlobalStyle.tableData}>{installment.installment_seq}</td>
                        <td className={GlobalStyle.tableCurrency}>{installment.Installment_Settle_Amount}</td>
                        <td className={GlobalStyle.tableData}>{new Date (installment.Plan_Date).toLocaleDateString("en-GB")}</td>
                        <td className={GlobalStyle.tableCurrency}>{installment.Installment_Paid_Amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
          ))}
        </div>
      )} */}
    </div>
    </div>
  );
}
