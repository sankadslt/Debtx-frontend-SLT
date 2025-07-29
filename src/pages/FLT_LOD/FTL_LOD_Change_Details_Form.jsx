import React from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function FTL_LOD_Change_Details_Form() {
  return (
    <>
      {/* Form */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={GlobalStyle.cardContainer}>
          <h1 className={`${GlobalStyle.headingLarge} text-center mb-4`}>
            Change Details
          </h1>

          <form className="w-full max-w-4xl mx-auto">
            <table className={GlobalStyle.table}>
              <tbody>
                {/* Field Rows */}
                <tr>
                  <td className={GlobalStyle.tableData}>Account No :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Select Option :</td>
                  <td className={GlobalStyle.tableData}>
                    <select className={`${GlobalStyle.selectBox} w-full`}>
                      <option value="">Event Source</option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Customer Name :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Address :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                {/* Dynamic Additional Fields */}
                {["", "", "", ""].map((label, index) => (
                  <tr key={index}>
                    <td className={GlobalStyle.tableData}>{label}</td>
                    <td className={GlobalStyle.tableData}>
                      <input
                        type="text"
                        className={`${GlobalStyle.inputText} w-full`}
                      />
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className={GlobalStyle.tableData}>Arrears :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Billing Centre :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                <tr>
                  <td className={GlobalStyle.tableData}>Customer Type :</td>
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="text"
                      className={`${GlobalStyle.inputText} w-full`}
                    />
                  </td>
                </tr>

                {/* Submit Row */}
                <tr>
                  <td></td>
                  <td className={`${GlobalStyle.tableData} text-right`}>
                    <button type="submit" className={GlobalStyle.buttonPrimary}>
                      Save
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </>
  );
}
