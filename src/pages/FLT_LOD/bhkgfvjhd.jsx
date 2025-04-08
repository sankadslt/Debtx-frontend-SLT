import React from 'react'

function bhkgfvjhd() {
    return (
        <>

            <div className={${GlobalStyle.cardContainer} w-full mb-8 mt-8}>
            <div className="flex items-center justify-end w-full space-x-6">
                <select value={status1} onChange={(e) => setStatus1(e.target.value)} style={{ color: status1 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                    <option value="" hidden >Action Type</option>
                    <option value="collect arrears" style={{ color: "black" }}>collect arrears</option>
                    <option value="collect arrears and CPE" style={{ color: "black" }}>collect arrears and CPE</option>
                    <option value="collect CPE" style={{ color: "black" }}>collect CPE</option>
                </select>

                <select value={status2} onChange={(e) => setStatus2(e.target.value)} style={{ color: status2 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                    <option value="" hidden>Status</option>
                    <option value="Incident Open" style={{ color: "black" }}>Incident Open</option>
                    <option value="Incident Reject" style={{ color: "black" }}>Incident Reject</option>
                </select>

                <select value={status3} onChange={(e) => setStatus3(e.target.value)} style={{ color: status3 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                    <option value="" hidden>Source Type</option>
                    <option value="Pilot Suspended" style={{ color: "black" }}>Pilot Suspended</option>
                    <option value="Product Terminate" style={{ color: "black" }}>Product Terminate</option>
                    <option value="Special" style={{ color: "black" }}>Special</option>
                </select>

                <label className={GlobalStyle.dataPickerDate}>Date:</label>
                <DatePicker selected={fromDate} onChange={handleFromDateChange} dateFormat="dd/MM/yyyy" placeholderText="From " className={GlobalStyle.inputText} />
                <DatePicker selected={toDate} onChange={handleToDateChange} dateFormat="dd/MM/yyyy" placeholderText="To " className={GlobalStyle.inputText} />

                <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button>
                <button className={GlobalStyle.buttonRemove} onClick={handlefilterclear} >
                    Clear
                </button>

                < /div>
            </div>



        </>
    )
}

export default bhkgfvjhd