import React from 'react'
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dispute_Settlement_Letter_Preview() {
  const navigate = useNavigate();

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h2 className={GlobalStyle.headingLarge}>Dispute Settlement Letter Preview</h2>

      {/* Case details card */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer}`}>
          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Case ID</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Account no</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Last Payment Date</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className={`${GlobalStyle.headingMedium}`}><b>Settlement Plan Details</b></h2>

      {/* Case details card */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer}`}>
          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Settlement ID</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Initial Amount</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Slab Count</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Slab 1</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Slab 2</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Slab 3</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>

          </div>
        </div>
      </div>


      <div className={'flex items-center justify-center mt-10'}>

                <div className={' bg-slate-100 h-[400px] w-[600px]  rounded-lg'}>
                    <div className={'flex justify-center items-center h-full'}>
                        <h1 className={GlobalStyle.headingLarge}>Preview of Settlement Letter</h1>
                    </div>

                </div>
            </div>
            <div className="flex items-center justify-end gap-4 mt-4 mb-4">
                <button className={`${GlobalStyle.buttonPrimary}`}>
                    Change Details
                </button>


                <button className={`${GlobalStyle.buttonPrimary}`}>
                    Create PDF
                </button>
            </div>


      <div>
        <button
          onClick={() => navigate(-1)}
          className={`${GlobalStyle.buttonPrimary} `}
        >
          <FaArrowLeft />
        </button>
      </div>

    </div>
  )
}
