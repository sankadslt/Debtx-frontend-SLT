// /*Purpose: Sign Up
// Created Date: 2025-06-07
// Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
// Updated Date: 
// Updated By: 
// UI Number: 17.1
// Dependencies: Tailwind CSS
// Related Files: 
// Notes: This component uses Tailwind CSS for styling */


import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import loginImage from "../../assets/images/login.png";

const SignUpPage = () => {
    // Login form state - ADDED
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loginData, setLoginData] = useState({
        serviceNo: "",
        password: ""
    });
    const [loginRememberMe, setLoginRememberMe] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});

    // Existing signup form state
    const [formData, setFormData] = useState({
        userType: "",
        serviceNo: "",
        name: "",
        nic: "",
        email: "",
        contact: "",
        loginMethod: "",
        roles: []
    });

    const [dropdowns, setDropdowns] = useState({
        userType: false,
        loginMethod: false,
        roles: false
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const userTypes = ["SLT", "DRC"];
    const loginMethods = ["Email", "Phone"];
    const availableRoles = ["GM", "DGM", "Legal Officer", "Manager", "Recovery Staff"];

    // Login form handlers - ADDED
    const handleLoginInputChange = (field, value) => {
        setLoginData(prev => ({
            ...prev,
            [field]: value
        }));

        if (loginErrors[field]) {
            setLoginErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateLoginForm = () => {
        const newErrors = {};

        if (!loginData.serviceNo) newErrors.serviceNo = "Service No is required";
        if (!loginData.password) newErrors.password = "Password is required";

        setLoginErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = () => {
        if (validateLoginForm()) {
            console.log("Login submitted:", loginData);
        }
    };

    // Login form render function - ADDED
    const renderLoginForm = () => (
        <div className="max-w-md mx-auto">
            <h1 className={GlobalStyle.headingLarge}>Login</h1>
            <h1 className={GlobalStyle.headingSmall}>Glad you're back !</h1>
            
            <div className="space-y-6">
                {/* Service No */}
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Service No"
                        value={loginData.serviceNo}
                        onChange={(e) => handleLoginInputChange('serviceNo', e.target.value)}
                        className={GlobalStyle.inputText + " w-full"}
                        style={{width: '500px', maxWidth: '100%'}}
                    />
                    {loginErrors.serviceNo && <p className="text-red-500 text-sm mt-1">{loginErrors.serviceNo}</p>}
                </div>

                {/* Password */}
                <div className="w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => handleLoginInputChange('password', e.target.value)}
                        className={GlobalStyle.inputText + " w-full"}
                        style={{width: '500px', maxWidth: '100%'}}
                    />
                    {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="loginRememberMe"
                        checked={loginRememberMe}
                        onChange={(e) => setLoginRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="loginRememberMe" className="ml-2 text-sm text-gray-600">
                        Remember me
                    </label>
                </div>

                {/* Login button */}
                <div className="flex gap-4 flex justify-center">
                    <button 
                        onClick={handleLoginSubmit}
                        className={GlobalStyle.buttonPrimary}
                    >
                        Login
                    </button>
                </div>

                {/* Forgot password */}
                <div className="text-center">
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                        Forgot password ?
                    </a>
                </div>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">Or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Switch to Sign Up */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => setIsLoginMode(false)}
                            className="text-blue-600 hover:underline"
                        >
                            Signup
                        </button>
                    </p>
                </div>

                {/* Footer links */}
                <div className="text-center text-xs text-gray-500 space-x-4">
                    <a href="#" className="hover:underline">Terms & Conditions</a>
                    <a href="#" className="hover:underline">Support</a>
                    <a href="#" className="hover:underline">Customer Care</a>
                </div>
            </div>
        </div>
    );

    // Existing functions unchanged
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const toggleDropdown = (dropdown) => {
        setDropdowns(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const selectOption = (field, value) => {
        handleInputChange(field, value);
        setDropdowns(prev => ({
            ...prev,
            [field]: false
        }));
    };

    const addRole = (role) => {
        if (!formData.roles.includes(role)) {
            handleInputChange('roles', [...formData.roles, role]);
        }
        setDropdowns(prev => ({ ...prev, roles: false }));
    };

    const removeRole = (roleToRemove) => {
        handleInputChange('roles', formData.roles.filter(role => role !== roleToRemove));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userType) newErrors.userType = "User Type is required";
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.contact) {
            newErrors.contact = "Contact number is required";
        } else if (!/^[0-9]{10}$/.test(formData.contact.replace(/\s+/g, ''))) {
            newErrors.contact = "Please enter a valid 10-digit contact number";
        }

        if (formData.userType === "SLT") {
            if (!formData.serviceNo) newErrors.serviceNo = "Service No is required";
            if (!formData.loginMethod) newErrors.loginMethod = "Login Method is required";
            if (formData.roles.length === 0) newErrors.roles = "At least one role is required";
        }

        if (formData.userType === "DRC") {
            if (!formData.nic) newErrors.nic = "NIC is required";
            if (!formData.loginMethod) newErrors.loginMethod = "Login Method is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Form submitted:", formData);
        }
    };

    const renderUserTypeSelection = () => (
        <div className="space-y-6">
            {/* User Type Dropdown */}
            <div className="w-full relative">
                <div
                    onClick={() => toggleDropdown('userType')}
                    className={GlobalStyle.selectBox + " cursor-pointer flex items-center justify-between"}
                    style={{width: '500px', maxWidth: '100%'}}
                >
                    <span className={formData.userType ? "text-gray-900" : "text-gray-500"}>
                        {formData.userType || "User Type"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdowns.userType ? 'rotate-180' : ''}`} />
                </div>
                
                {dropdowns.userType && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10"
                         style={{width: '500px', maxWidth: '100%'}}>
                        {userTypes.map((type) => (
                            <div
                                key={type}
                                onClick={() => selectOption('userType', type)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                )}
                {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
            </div>
        </div>
    );

    const renderSLTForm = () => (
        <div className="space-y-6">
            {/* Service No */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Service No"
                    value={formData.serviceNo}
                    onChange={(e) => handleInputChange('serviceNo', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.serviceNo && <p className="text-red-500 text-sm mt-1">{errors.serviceNo}</p>}
            </div>

            {/* Name */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="w-full">
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Contact No"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Login Method Dropdown */}
            <div className="w-full relative">
                <div
                    onClick={() => toggleDropdown('loginMethod')}
                    className={GlobalStyle.selectBox + " cursor-pointer flex items-center justify-between"}
                    style={{width: '500px', maxWidth: '100%'}}
                >
                    <span className={formData.loginMethod ? "text-gray-900" : "text-gray-500"}>
                        {formData.loginMethod || "Login Method"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdowns.loginMethod ? 'rotate-180' : ''}`} />
                </div>
                
                {dropdowns.loginMethod && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10"
                         style={{width: '500px', maxWidth: '100%'}}>
                        {loginMethods.map((method) => (
                            <div
                                key={method}
                                onClick={() => selectOption('loginMethod', method)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            >
                                {method}
                            </div>
                        ))}
                    </div>
                )}
                {errors.loginMethod && <p className="text-red-500 text-sm mt-1">{errors.loginMethod}</p>}
            </div>

            {/* Roles Multi-select */}
            <div className="w-full relative">
                <div
                    onClick={() => toggleDropdown('roles')}
                    className={GlobalStyle.selectBox + " cursor-pointer flex items-center justify-between min-h-[48px]"}
                    style={{width: '500px', maxWidth: '100%'}}
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        {formData.roles.length > 0 ? (
                            formData.roles.map((role) => (
                                <span
                                    key={role}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {role}
                                    <X
                                        className="w-4 h-4 ml-1 cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRole(role);
                                        }}
                                    />
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">Roles</span>
                        )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdowns.roles ? 'rotate-180' : ''}`} />
                </div>
                
                {dropdowns.roles && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10"
                         style={{width: '500px', maxWidth: '100%'}}>
                        {availableRoles.map((role) => (
                            <div
                                key={role}
                                onClick={() => addRole(role)}
                                className={`px-4 py-3 hover:bg-blue-50 cursor-pointer ${
                                    formData.roles.includes(role) ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                            >
                                {role}
                            </div>
                        ))}
                    </div>
                )}
                {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
            </div>
        </div>
    );

    const renderDRCForm = () => (
        <div className="space-y-6">
            {/* Name */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* NIC */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="NIC"
                    value={formData.nic}
                    onChange={(e) => handleInputChange('nic', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
            </div>

            {/* Email */}
            <div className="w-full">
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Contact No"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className={GlobalStyle.inputText + " w-full"}
                    style={{width: '500px', maxWidth: '100%'}}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Login Method Dropdown */}
            <div className="w-full relative">
                <div
                    onClick={() => toggleDropdown('loginMethod')}
                    className={GlobalStyle.selectBox + " cursor-pointer flex items-center justify-between"}
                    style={{width: '500px', maxWidth: '100%'}}
                >
                    <span className={formData.loginMethod ? "text-gray-900" : "text-gray-500"}>
                        {formData.loginMethod || "Login Method"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdowns.loginMethod ? 'rotate-180' : ''}`} />
                </div>
                
                {dropdowns.loginMethod && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10"
                         style={{width: '500px', maxWidth: '100%'}}>
                        {loginMethods.map((method) => (
                            <div
                                key={method}
                                onClick={() => selectOption('loginMethod', method)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            >
                                {method}
                            </div>
                        ))}
                    </div>
                )}
                {errors.loginMethod && <p className="text-red-500 text-sm mt-1">{errors.loginMethod}</p>}
            </div>
        </div>
    );

    // Render signup form content - MODIFIED to add switch to login
    const renderSignUpForm = () => (
        <div className="max-w-md mx-auto">
            <h1 className={GlobalStyle.headingLarge}>Sign Up</h1>
            <h1 className={GlobalStyle.headingSmall}>Welcome !</h1>
            
            <div className="space-y-6">
                {!formData.userType && renderUserTypeSelection()}
                
                {formData.userType === "SLT" && renderSLTForm()}
                {formData.userType === "DRC" && renderDRCForm()}

                {formData.userType && (
                    <>
                        {/* Remember me checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        {/* Register button */}
                        <div className="flex gap-4 flex justify-center">
                            <button 
                                onClick={handleSubmit}
                                className={GlobalStyle.buttonPrimary}
                            >
                                Register
                            </button>
                        </div>

                        {/* Footer links */}
                        <div className="text-center space-y-2 text-sm">
                            <a href="#" className="text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button 
                                    onClick={() => setIsLoginMode(true)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        </div>

                        {/* Terms and conditions */}
                        <div className="text-center text-xs text-gray-500 space-x-4">
                            <a href="#" className="hover:underline">Terms & Conditions</a>
                            <a href="#" className="hover:underline">Support</a>
                            <a href="#" className="hover:underline">Customer Care</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Background decorative shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-green-200 rounded-full opacity-30"></div>
                <div className="absolute bottom-20 left-20 w-28 h-28 bg-purple-200 rounded-full opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-36 h-36 bg-yellow-200 rounded-full opacity-30"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Left side - Illustration */}
                    <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                        <div className="text-center">
                            <img 
                                src={loginImage}
                                alt="Login Illustration" 
                                className="w-full h-auto max-w-md"
                            />
                        </div>
                    </div>

                    {/* Right side - Login or Sign up form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        {isLoginMode ? renderLoginForm() : renderSignUpForm()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;


