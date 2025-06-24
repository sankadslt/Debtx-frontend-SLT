/*Purpose: Sign Up
Created Date: 2025-06-07
Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Updated Date: 
Updated By: 
UI Number: 17.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This component uses Tailwind CSS for styling */


import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import loginImage from "../../assets/images/login.png";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        serviceNo: "",
        name: "",
        email: "",
        userType: "",
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

    const userTypes = ["Admin", "Manager", "DGM", "Coordinator", "User"];
    const loginMethods = ["Email", "Phone"];
    const availableRoles = ["GM" ,"DGM" , "Legal Officer" , "Manager" , "Recovery Staff"];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
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

        if (!formData.serviceNo) newErrors.serviceNo = "Service No is required";
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
        if (!formData.userType) newErrors.userType = "User Type is required";
        if (!formData.loginMethod) newErrors.loginMethod = "Login Method is required";
        if (formData.roles.length === 0) newErrors.roles = "At least one role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Form submitted:", formData);
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>

            {/* Background decorative shapes */}


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

                    {/* Right side - Sign up form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-md mx-auto">
                            <h1 className={GlobalStyle.headingLarge}>Sign Up</h1>
                            <h1 className={GlobalStyle.headingSmall}>Welcome !</h1>
                            <div className="space-y-6">

                                <div className="w-full">
                                    <select className={GlobalStyle.selectBox} style={{width: '500px', maxWidth: '100%'}}>
                                        <option value="">User Type</option>
                                        <option value="option1"> Admin </option>
                                        <option value="option2"> Manager </option>
                                        <option value="option3"> DGM </option>
                                        <option value="option3"> User </option>

                                    </select>
                                </div>
                                {/* Service No */}
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Service Type"
                                        className={GlobalStyle.inputText + " w-full"}
                                        style={{width: '500px', maxWidth: '100%'}}
                                    />
                                </div>


                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className={GlobalStyle.inputText + " w-full"}
                                        style={{width: '500px', maxWidth: '100%'}}
                                    />
                                </div>
                                {/* Email */}
                                <div className="w-full">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={GlobalStyle.inputText+" w-full"}
                                        style={{width: '500px', maxWidth: '100%'}}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* contact */}
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Contact"
                                        value={formData.contact}
                                        onChange={(e) => handleInputChange('contact', e.target.value)}
                                        className={GlobalStyle.inputText + " w-full"}
                                        style={{width: '500px', maxWidth: '100%'}}
                                    />
                                </div>

                                <div className="w-full">
                                    <select className={GlobalStyle.selectBox} style={{width: '500px', maxWidth: '100%'}}>
                                        <option value="">Login Method </option>
                                        <option value="option2"> Email </option>
                                        <option value="option3"> Phone </option>
                                    </select>
                                </div>

                                <div className="w-full">

                                    <select className={GlobalStyle.selectBox} style={{width: '500px', maxWidth: '100%'}}>
                                        <option value=""> Roles </option>
                                        <option value="option2"> GM </option>
                                        <option value="option3"> DGM </option>
                                        <option value="option3"> Legal Officer </option>
                                        <option value="option3"> Manager </option>
                                        <option value="option3"> Recovery Staff </option>
                                    </select>
                                </div>

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
                                    <button className={GlobalStyle.buttonPrimary}>Register</button>
                                </div>
                                {/* Footer links */}
                                <div className="text-center space-y-2 text-sm">
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Forgot password?
                                    </a>
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <a href="#" className="text-blue-600 hover:underline">
                                            Login
                                        </a>
                                    </p>
                                </div>

                                {/* Terms and conditions */}
                                <div className="text-center text-xs text-gray-500 space-x-4">
                                    <a href="#" className="hover:underline">Terms & Conditions</a>
                                    <a href="#" className="hover:underline">Support</a>
                                    <a href="#" className="hover:underline">Customer Care</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
