import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import { Case_Details_Settlement_Phase } from "../../services/settlement/SettlementServices";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function CreateSettlementPlan2() {
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [error, setError] = useState("");
  const [settlementCount, setSettlementCount] = useState(0);
  const [caseDetails, setCaseDetails] = useState([]);
  const [phaseText, setphaseText] = useState("");
  const [initialAmount, setinitialAmount] = useState("");
  const [slabCount, setSlabCount] = useState("");
  const [slab1Amount, setSlab1Amount] = useState("");
  const [slab2Amount, setSlab2Amount] = useState("");
  const [slab3Amount, setSlab3Amount] = useState("");
  const [remarkText, setRemarkText] = useState("");
  //const { caseId } = useParams(); // Get caseId from URL

  const caseId = location.state?.case_Id;
  console.log("Case ID from URL:", caseId);
  const data = [
    {
      seqNo: "1",
      installmentSettleAmount: "30,000",
      planDate: "mm/dd/yyyy",
      installmentPaidAmount: "25000",
    },
  ];
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const payload = { case_id: 4 };
        console.log("Sending API request with payload:", payload);
        const response = await Case_Details_Settlement_Phase(payload);
        console.log("API Response:", response);
        console.log("Case details received:", response);
        setCaseDetails(response);
        setSettlementCount(response?.settlement_count);
      } catch (error) {
        console.error("Error fetching case details:", error);
        setCaseDetails([]);
      }
    };
    fetchCaseDetails();
  }, []);

  useEffect(() => {
    const payload = {
      case_id: caseId,
      phase: phaseText,
      settlement_count: settlementCount,
      initial_amount: initialAmount,
      slab_count: slabCount,
      slab1_amount: slab1Amount,
      slab2_amount: slab2Amount,
      slab3_amount: slab3Amount,
      remark: remarkText,
    };
    console.log("Sending API request with payload:", payload);
  });

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div>
        <h1 className={GlobalStyle.headingLarge}>Create Settlement</h1>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        <div className={GlobalStyle.cardContainer}>
          <form className="flex flex-col gap-4">
            <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
              {/* Card Box */}
              <div className={`${GlobalStyle.cardContainer}`}>
                <p className="flex gap-3 mb-2">
                  <strong>Case ID: </strong>
                  <div> {caseDetails?.case_id}</div>
                </p>
                <p className="mb-2">
                  <strong>Customer Ref: </strong>
                  {caseDetails?.customer_ref}
                </p>
                <p className="flex gap-3 mb-2">
                  <strong>Account no: </strong>
                  <div> {caseDetails?.account_no}</div>
                </p>
                <p className="mb-2">
                  <strong>Arrears Amount: </strong>
                  {caseDetails?.current_arrears_amount}
                </p>
                <p className="mb-2">
                  <strong>Last Payment Date: </strong>
                  {new Date(
                    caseDetails?.last_payment_date
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* Input Fields */}
              <div className="flex gap-4">
                <h1
                  style={{ width: "15vw" }}
                  className={GlobalStyle.remarkTopic}
                >
                  Phase
                </h1>
                <div style={{ width: "2vw" }}>:</div>
                <input
                  type="text"
                  placeholder="Text here"
                  className={GlobalStyle.inputText}
                  value={phaseText}
                  onChange={(e) => setphaseText(e.target.value)}
                  style={{ width: "50vw" }}
                />
              </div>
              <br />

              <div className="flex gap-4">
                <h1
                  style={{ width: "15vw" }}
                  className={GlobalStyle.remarkTopic}
                >
                  Case Status
                </h1>
                <div style={{ width: "2vw" }}>:</div>
                <div style={{ width: "50vw" }}>
                  {" "}
                  {caseDetails?.case_current_status}
                </div>
              </div>
              <br />

              <div className="flex gap-4">
                <h1
                  style={{ width: "15vw" }}
                  className={GlobalStyle.remarkTopic}
                >
                  Settlement Count:
                </h1>
                <div style={{ width: "2vw" }}>:</div>
                <div style={{ width: "50vw" }}>
                  {" "}
                  {caseDetails?.settlement_count}
                </div>
              </div>
              <br />

              <div className="flex items-center gap-2">
                <h1
                  style={{ width: "9.5vw" }}
                  className={GlobalStyle.remarkTopic}
                >
                  Settlement plan
                </h1>

                <div style={{ width: "2vw" }}>:</div>

                <select
                  className={GlobalStyle.selectBox}
                  style={{ width: "40vw" }}
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="" disabled>
                    Select plan
                  </option>
                  <option value="plan1">Plan 1</option>
                  <option value="plan2">Plan 2</option>
                </select>
              </div>

              <br />

              <>
                <div className="flex gap-4 mt-4">
                  <h1
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Initial Amount:
                  </h1>
                  <div style={{ width: "2vw" }}>:</div>
                  <input
                    type="text"
                    placeholder="Text here"
                    className={GlobalStyle.inputText}
                    value={initialAmount}
                    onChange={(e) => setinitialAmount(e.target.value)}
                    style={{ width: "50vw" }}
                  />
                </div>
                <br />

                <div className="mb-6 flex items-center gap-3">
                  <label
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Slab Count
                  </label>
                  <div style={{ width: "2vw" }}>:</div>
                  <input
                    type="number"
                    className={`${GlobalStyle.inputText}`}
                    value={slabCount}
                    onChange={(e) => setSlabCount(e.target.value)}
                    style={{ width: "50vw" }}
                    min="0"
                    max="12"
                  />
                </div>

                <div className="flex gap-4">
                  <h1
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Slab 1 Amount
                  </h1>
                  <div style={{ width: "2vw" }}>:</div>
                  <input
                    type="text"
                    placeholder="Text here"
                    className={GlobalStyle.inputText}
                    value={slab1Amount}
                    onChange={(e) => setSlab1Amount(e.target.value)}
                    style={{ width: "50vw" }}
                  />
                </div>
                <br />
                <div className="flex gap-4">
                  <h1
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Slab 2 Amount
                  </h1>
                  <div style={{ width: "2vw" }}>:</div>
                  <input
                    type="text"
                    placeholder="Text here"
                    className={GlobalStyle.inputText}
                    value={slab2Amount}
                    onChange={(e) => setSlab2Amount(e.target.value)}
                    style={{ width: "50vw" }}
                  />
                </div>
                <br />
                <div className="flex gap-4">
                  <h1
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Slab 3 Amount
                  </h1>
                  <div style={{ width: "2vw" }}>:</div>
                  <input
                    type="text"
                    placeholder="Text here"
                    className={GlobalStyle.inputText}
                    value={slab3Amount}
                    onChange={(e) => setSlab3Amount(e.target.value)}
                    style={{ width: "50vw" }}
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  {/* Duration Row */}
                  <div className="flex items-start">{/* Left Label */}</div>
                </div>

                <br />

                <div className="mb-6">
                  <label
                    style={{ width: "15vw" }}
                    className={GlobalStyle.remarkTopic}
                  >
                    Remark
                  </label>

                  <textarea
                    className={`${GlobalStyle.remark}`}
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    rows="5"
                  ></textarea>
                </div>
                <br />

                {/* Dynamically Render Tables Based on Settlement Count */}
                {caseDetails?.settlement_plans?.map((plan, index) => (
                  <div
                    key={plan.settlement_id}
                    className={GlobalStyle.tableContainer}
                  >
                    <h2 className={GlobalStyle.remarkTopic}>
                      Settlement ID: {plan.settlement_id}
                    </h2>
                    <div>
                      {/* Table */}
                      <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                          <thead className={GlobalStyle.thead}>
                            <tr>
                              <th className={GlobalStyle.tableHeader}>SeqNo</th>
                              <th className={GlobalStyle.tableHeader}>
                                Installment Settle Amount
                              </th>
                              <th className={GlobalStyle.tableHeader}>
                                Plan Date
                              </th>
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
                    </div>
                  </div>
                ))}
                <br />

                <div className="flex gap-4 justify-end">
                  <button className={GlobalStyle.buttonPrimary}>Submit</button>
                </div>
              </>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
