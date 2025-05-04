import React from 'react'
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function Dispute_Letter_Preview() {
    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h1 className={GlobalStyle.headingLarge}>Preview of Dispute Letter</h1>


            <div className={'flex items-center justify-center mt-10'}>

                <div className={' bg-slate-100 h-[400px] w-[600px]  rounded-lg'}>
                    <div className={'flex justify-center items-center h-full'}>
                        <h1 className={GlobalStyle.headingLarge}>Preview of Dispute Letter</h1>
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

        </div>
    );
}
