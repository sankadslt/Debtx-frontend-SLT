import React, { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import signUpImage from "../../assets/images/User/SignUp.jpeg";

const SignUp = () => {
    const [userType, setUserType] = useState("");
    const [formData, setFormData] = useState({
        serviceNo: "",
        name: "",
        nic: "",
        email: "",
        contactNo: "",
        loginMethod: "",
        role: "",
    });

    const [selectedRole, setSelectedRole] =useState("");
    const [selectedDRC, setSelectedDRC] =useState("");

    // Clear form data when user type is changed
    useEffect(() => {
        setFormData({
            serviceNo: "",
            name: "",
            nic: "",
            email: "",
            contactNo: "",
            loginMethod: "",
            role: "",
        });
    }, [userType])
    

    //Roles available for the dropdown
    const userRoles = [
        { value: "", label: "User Role", hidden: true },
        { value: "GM", label: "GM" },
        { value: "DGM", label: "DGM" },
        { value: "legal_officer", label: "Legal Officer" },
        { value: "manager", label: "Manager" },
        { value: "slt_coordinator", label: "SLT Coordinator" },
        { value: "DRC_user", label: "DRC User" },
        { value: "recovery_staff", label: "Recovery Staff" },
        { value: "rtom", label: "RTOM" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = () => {
        if (!userType) {
            alert("Please select a user type.");
            return;
        }

        const payload = {
            userType,
            ...(userType === "SLT" ? formData : {}),
            ...(userType === "DRC" ? {
                name: formData.name,
                nic: formData.nic,
                email: formData.email,
                contactNo: formData.contactNo,
                loginMethod: formData.loginMethod,
            } : {})
        };

        console.log("Registering with payload:", payload);
    };

    return (
        <div className="min-h-screen flex items-start justify-center mt-12">
            <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden w-[70%] max-w-3xl shadow-lg">
                {/* Left - Image */}
                <div className="w-full md:w-1/2 h-[650px]">
                    <img
                        src={signUpImage}
                        alt="Sign Up Visual"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right - Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-10 bg-white text-blue-900">
                    <h4 className={`${GlobalStyle.headingLarge}`} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Sign Up
                    </h4>
                    <p className="mb-6">Welcome.!</p>

                    {/* User Type Dropdown */}
                    <div className="mb-4">
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className={`${GlobalStyle.selectBox} w-full text-blue-900 placeholder-blue-900 py-2 pl-2`}
                        >
                            <option value="" disabled hidden>User Type</option>
                            <option value="DRC">DRC</option>
                            <option value="SLT">SLT</option>
                        </select>
                    </div>

                    {/* DRC Form */}
                    {userType === "DRC" && (
                        <>  
                            <div className="mb-2">
                                <select
                                    value={selectedDRC}
                                    onChange={(e) => setSelectedDRC(e.target.value)}
                                    className={`${GlobalStyle.selectBox} w-full text-blue-900 placeholder-blue-900 py-2 pl-2`}
                                >
                                    <option value="" disabled hidden>Select DRC</option>
                                    <option value="">Option 1</option>
                                    <option value="">Option 2</option>
                                </select>
                            </div>

                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="text"
                                name="nic"
                                placeholder="NIC"
                                value={formData.nic}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="text"
                                name="contactNo"
                                placeholder="Contact No"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <select
                                name="loginMethod"
                                value={formData.loginMethod}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            >
                                <option value="" disabled hidden>Login Method</option>
                                <option value="Gmail">Gmail</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </>
                    )}

                    {/* SLT Form */}
                    {userType === "SLT" && (
                        <>
                            <input
                                type="text"
                                name="serviceNo"
                                placeholder="Service No"
                                value={formData.serviceNo}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <input
                                type="text"
                                name="contactNo"
                                placeholder="Contact No"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            />
                            <select
                                name="loginMethod"
                                value={formData.loginMethod}
                                onChange={handleInputChange}
                                className={`${GlobalStyle.selectBox} w-full mb-2 text-blue-900 placeholder-blue-900 py-2 pl-2`}
                            >
                                <option value="" disabled hidden>Login Method</option>
                                <option value="Gmail">Gmail</option>
                                <option value="Manual">Manual</option>
                            </select>
                            <select
                              className={`${GlobalStyle.selectBox} w-full text-blue-900 placeholder-blue-900 py-2 pl-2`}
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">User Role</option>
                                {userRoles.map((role) => (
                                    <option
                                        key={role.value}
                                        value={role.value}
                                        hidden={role.hidden}
                                        style={{ color: "black" }}
                                    >
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <div className="w-full">
                        <button
                            onClick={handleRegister}
                            disabled ={!userType}
                            className={`${GlobalStyle.buttonPrimary} w-full max-w-40 sm:max-w-48 md:max-w-56 lg:max-w-64 bg-blue-900 text-white font-bold text-center mt-4 py-2 rounded-md  disabled:text-gray-400 disabled:cursor-not-allowed`}
                        >
                            Register
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignUp;
