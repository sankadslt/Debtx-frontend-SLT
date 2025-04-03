import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";

export default function CreateSettlementPlan() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(2);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [settlementCount, setSettlementCount] = useState(0);

  const data = [
    {
      seqNo: "1",
      installmentSettleAmount: "30,000",
      planDate: "mm/dd/yyyy",
      installmentPaidAmount: "25000",
    },
  ];

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

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div>
        <h1 className={GlobalStyle.headingLarge}>Create Settlement</h1>
      </div>
      <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
        {/* Card Box */}
        <div className={`${GlobalStyle.cardContainer}`}>
          <p className="mb-2">
            <strong>Case ID:</strong>
          </p>
          <p className="mb-2">
            <strong>Customer Ref:</strong>
          </p>
          <p className="mb-2">
            <strong>Account no:</strong>
          </p>
          <p className="mb-2">
            <strong>Arrears Amount:</strong>
          </p>
          <p className="mb-2">
            <strong>Last Payment Date:</strong>
          </p>
        </div>

        {/* Input Fields */}
        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Phase:</h1>
          <input
            type="text"
            placeholder="Text here"
            className={GlobalStyle.inputText}
          />
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Case Status:</h1>
          <input
            type="text"
            placeholder="Text here"
            className={GlobalStyle.inputText}
          />
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Settlement Count:</h1>
          <input
            type="number"
            min="1"
            value={settlementCount}
            onChange={(e) => setSettlementCount(parseInt(e.target.value) || 0)}
            className={GlobalStyle.inputText}
          />
        </div>
        <br />

        <div className="flex gap-4">
          <h1 className={GlobalStyle.remarkTopic}>Settlement plan:</h1>
          <select
            className={GlobalStyle.selectBox}
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

        {selectedPlan === "plan1" && (
          <>
            <div className="flex gap-4 mt-4">
              <h1 className={GlobalStyle.remarkTopic}>Initial Amount:</h1>
              <input
                type="text"
                placeholder="Text here"
                className={GlobalStyle.inputText}
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
              />
            </div>

            <div>
              <h1 className={GlobalStyle.remarkTopic}>Duration:</h1>
            </div>
            <br />

            <div className={GlobalStyle.datePickerContainer}>
              <h1 className={GlobalStyle.remarkTopic}>From:</h1>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
              <h1 className={GlobalStyle.remarkTopic}>To:</h1>
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
            <br />

            <div className="mb-6">
              <label className={GlobalStyle.remarkTopic}>Remark</label>
              <textarea className={`${GlobalStyle.remark}`} rows="5"></textarea>
            </div>
            <br />

            {/* Dynamically Render Tables Based on Settlement Count */}
            {Array.from({ length: settlementCount }, (_, index) => (
              <div key={index} className={GlobalStyle.tableContainer}>
                <h2 className={GlobalStyle.remarkTopic}>
                  Settlement {index + 1}
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
                          <th className={GlobalStyle.tableHeader}>Plan Date</th>
                          <th className={GlobalStyle.tableHeader}>
                            Installment Paid Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className={GlobalStyle.tableData}>
                              {row.seqNo}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {row.installmentSettleAmount}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {row.planDate}
                            </td>
                            <td className={GlobalStyle.tableData}>
                              {row.installmentPaidAmount}
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
        )}
      </div>
    </div>
  );
}
