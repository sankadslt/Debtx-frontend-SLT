/*Purpose: This template is used for the 1.A.15 - Amend Assigned DRC
Created Date: 2025-01-28
Created By: Malindu (mhssc20@gmail.com)
Version: node 20
ui number : 1.A.15
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Minorbw from "../../assets/images/minorbw.png";
import Plusbw from "../../assets/images/plusbw.png";
import Minorc from "../../assets/images/minorc.png";
import Plusc from "../../assets/images/plusc.png";



export default function AmendAssignedDRC() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const cpeData = [
        { DRS1Count: "100", DRC1: "DRC", RTOM: "AD" , DRC2: "DRC 2", DRS2Count: "250" },
        { DRS1Count: "300", DRC1: "DRC", RTOM: "GM" , DRC2: "DRC 2", DRS2Count: "500" },
        { DRS1Count: "600", DRC1: "DRC", RTOM: "KU" , DRC2: "DRC 2", DRS2Count: "750" },
        { DRS1Count: "500", DRC1: "DRC", RTOM: "AD" , DRC2: "DRC 2", DRS2Count: "100" },

        
    ];

    const handleonclick = () => {
        alert("Submit successfully");
    };

    const handledeleteclick = () => {
        alert("Delete successfully");
    };

    const handleaddclick = () => {
        alert("Add successfully");
    };


    //search function
    const filteredData = cpeData.filter((row) =>
        Object.values(row)
            .join("")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );


    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className={GlobalStyle.headingLarge}>Exchange DRC Assign Pending Cases</h1>
            </div>

            {/* Card Section */}
            <div className="flex flex-col items-center justify-center mb-4">
                    <div className={`${GlobalStyle.cardContainer}`}>
                        <p className="mb-2"><strong>Batch ID:</strong></p>
                        <p className="mb-2"><strong>Create DTM:</strong></p>
                        <p className="mb-2"><strong>Arrears Band:</strong></p>
                        <p className="mb-2"><strong>Action Type:</strong></p>
                        <p className="mb-2"><strong>Case Count:</strong></p>
                        <p className="mb-2"><strong>Total Arrears Amount:</strong></p>
                        
                    </div>
                </div>

            {/* case count Bar */}
            <div className={`${GlobalStyle.miniCaseCountBar} `}>
                <div className="flex px-3 py-2 items-center  gap-4 ">
                    <img src={Minorc} alt="Icon" className="w-[20px] h-[20px] "/>
                    {/* dropdown */}
                    <div className="flex gap-4">
                        <select className={GlobalStyle.selectBox}>
                            <option value="DRC">DRC</option>
                            <option value="DRC">DRC</option>
                            <option value="DRC">DRC</option>
                        </select>
                    </div>
                    {/* dropdown */}
                    <div className="flex gap-4">
                        <select className={GlobalStyle.selectBox}>
                            <option value="RTOM">RTOM</option>
                            <option value="RTOM">RTOM</option>
                            <option value="RTOM">RTOM</option>
                        </select>
                    </div>
                    {/* textbox */}
                    <div className="flex gap-4">
                        <h1>Assigned case count :</h1>
                            <input type="text" placeholder="Enter case count" className={GlobalStyle.inputText}/>
                    </div>
                </div>
                <div className="flex px-3 py-2 items-center  gap-4 ">
                    <img src={Plusc} alt="Icon" className="w-[20px] h-[20px] "/>
                    {/* dropdown */}
                    <div className="flex gap-4">
                        <select className={GlobalStyle.selectBox}>
                            <option value="DRC">DRC</option>
                            <option value="DRC">DRC</option>
                            <option value="DRC">DRC</option>
                        </select>
                    </div>
                </div>
                {/* button */}
                <div className="flex justify-end mr-5">
                     <button
                         onClick={handleaddclick}
                        className={`${GlobalStyle.buttonPrimary} w-[80px] h-[35px]`}
                        >
                        Add
                    </button>
                </div>

            </div>

            {/* Table Section */}
            <div className="flex flex-col">
                {/* Search Bar Section */}
                <div className="mb-4 flex justify-start">
                    <div className={GlobalStyle.searchBarContainer}>
                        <input
                        type="text"
                        placeholder=""
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>
                </div>
                <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th className={GlobalStyle.tableHeader}>RTOM</th>
                                <th className={GlobalStyle.tableHeader}>DRC 1</th>
                                <th className={`${GlobalStyle.tableHeader} flex justify-center items-center`}>
                                    <img src={Minorbw} alt="Icon" className="w-[20px] h-[20px] "/>
                                </th>
                                <th className={GlobalStyle.tableHeader}>DRC 2</th>
                                <th className={`${GlobalStyle.tableHeader} flex justify-center items-center`}>
                                    <img src={Plusbw} alt="Icon" className="w-[20px] h-[20px] "/>
                                </th>
                                <th className={GlobalStyle.tableHeader}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr
                                    key={item.date}
                                    className={
                                        index % 2 === 0
                                            ? GlobalStyle.tableRowEven
                                            : GlobalStyle.tableRowOdd
                                    }
                                >
                                    <td className={GlobalStyle.tableData}>{item.RTOM}</td>
                                    <td className={GlobalStyle.tableData}>{item.DRC1}</td>
                                    <td className={GlobalStyle.tableData}>{item.DRS1Count}</td>
                                    <td className={GlobalStyle.tableData}>{item.DRC2}</td>
                                    <td className={GlobalStyle.tableData}>{item.DRS2Count}</td>
                                    <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={handledeleteclick}
                                        className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}>
                                         Delete
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleonclick}
                    className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
