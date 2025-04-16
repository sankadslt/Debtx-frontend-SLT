/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-02
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect } from "react"
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useRef } from "react";

export const Litigation_Fail_Update = ({isOpen, onClose}) => {
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef} className="flex flex-col relative w-[800px] h-[400px] p-16 bg-[#E1E4F5] rounded-tr-2xl">
                <h1 className={GlobalStyle.headingLarge}>Legal Fail Update</h1>

                {/* Remark */}
                <div className="flex flex-col gap-2 justify-start mb-4 mt-8">
                    <label className="w-full text-start">Remark : </label>
                    <textarea className={`${GlobalStyle.inputText} h-40`}/>
                </div>

                {/* Submit */}
                <div className="flex w-full justify-end">
                        <button className={GlobalStyle.buttonPrimary}>
                            Write Off
                        </button>
                </div>
            </div>
        </div>
    )
}
