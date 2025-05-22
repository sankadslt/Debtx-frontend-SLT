import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard , MdFormatListBulletedAdd , MdDoneOutline } from "react-icons/md";
import { IoIosListBox } from "react-icons/io";
import { MdSpeakerNotes } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { GrConfigure } from "react-icons/gr";
import { FaListCheck } from "react-icons/fa6";
import { BiSolidDiamond } from "react-icons/bi";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { MdDownload } from "react-icons/md";


import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../services/auth/authService";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CgEditFade } from "react-icons/cg";

const Sidebar = ({ onHoverChange }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const sidebarRef = useRef(null);

  const loadUserRole = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      setUserRole(null);
      return;
    }
    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        token = await refreshAccessToken();
        if (!token) return;
        decoded = jwtDecode(token);
      }
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Invalid token:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    loadUserRole();
  }, [localStorage.getItem("accessToken")]);

  // Menu structure with nested subtopics
  const menuItems = [
    { icon: MdSpaceDashboard, label: "Dashboard", link: "/dashboard", roles: ["superadmin", "admin", "user"] },

    {
      icon: IoIosListBox,
      label: "User List",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: CgEditFade, label: "SLT Staff", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "DRC List", link: "/pages/DRC/DRCList", roles: ["superadmin", "admin"], subItems: [
          {icon:CgEditFade, label:"RO List", link:"/dashboard", roles:["superadmin", "admin"]},
        ] },
      ],
    },

    { icon: GoChecklist, 
      label: "Incident List", 
      roles: ["superadmin", "admin", "user"], 
      subItems: [
        { icon: CgEditFade, label: " Register Accounts",  roles: ["superadmin", "admin"], subItems: [
          {icon:CgEditFade, label:"Bulk", link:"/incident/upload-log", roles:["superadmin", "admin"]},
          {icon:CgEditFade, label:"Individual", link:"/Incident/Incident_List", roles:["superadmin", "admin"]}, ] },
        { icon: CgEditFade, label: "New Reg Incidents", link: "", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "Filtered Incidents", link: "/Distribution/filtered-incident", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "Bulk Upload History", link: "/incident/upload-log", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "Rejected log", link: "/Distribution/reject-incident-log", roles: ["superadmin", "admin"] },
      ],
    },

    { icon: MdSpeakerNotes, label: "Case Distribution", link: "", roles: ["superadmin", "admin", "user"], subItems: [
      {icon:CgEditFade, label:"Ready For Distribution", link:"/pages/Distribute/DistributionPreparationBulkUpload", roles:["superadmin", "admin"]},
      {icon:CgEditFade, label:"Pending Distribution", link:"/pages/Distribute/AssignedDRCSummary", roles:["superadmin", "admin"]},
    ] },

    {
      icon: FaListCheck,
      label: "Cases",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        // { icon: CgEditFade, label: "Case List", link: "/Incident/Case_List", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, 
          label: "DRC Assigned Case List", 
          roles: ["superadmin", "admin"], 
          subItems: [
            {icon:CgEditFade, label:"Medeation Board List", link:"/MediationBoard/MediationBoardCaseList", roles:["superadmin", "admin"]},
          ],
        },
        // { icon: CgEditFade, label: "FTL LOD", link: "/dashboard", roles: ["superadmin", "admin"] },
        // { icon: CgEditFade, label: "Direct LOD", link: "/dashboard", roles: ["superadmin", "admin"] },
        // { icon: CgEditFade, label: "Litigation", link: "/pages/Litigation/Litigation_List", roles: ["superadmin", "admin"] },
        // { icon: CgEditFade, label: "Dispute", link: "/dashboard", roles: ["superadmin", "admin"] },
        // { icon: CgEditFade, 
        //   label: "Disposed List", 
        //   roles: ["superadmin", "admin"],
        //   subItems: [
        //     {icon:CgEditFade, label:"Write off List", link:"/dashboard", roles:["superadmin", "admin"]},
        //     {icon:CgEditFade, label:"Abandoned List", link:"/dashboard", roles:["superadmin", "admin"]},
        //     {icon:CgEditFade, label:"Withdraw List", link:"/dashboard", roles:["superadmin", "admin"]},
        //     {icon:CgEditFade, label:"Closed List", link:"/dashboard", roles:["superadmin", "admin"]},
        //   ],
        // },
      ],
    },

    {
      icon: HiOutlineDocumentCheck, 
      label: "Settlement", 
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: CgEditFade, label: "Settlement ", link: "/pages/Settlement/MonitorSettlement", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "Payment", link: "/pages/Money_Transaction/MoneyTransaction", roles: ["superadmin", "admin"] },
        { 
          icon: CgEditFade, 
          label: "Commission", 
          link: "/Commission/CommissionCaseList", 
          roles: ["superadmin", "admin"] 
        },
      ],
    },
    {icon: MdFormatListBulletedAdd, label: "Request List", link: "/dashboard", roles: ["superadmin", "admin", "user"]},
    {
      icon: MdDoneOutline, 
      label: "Approvals", 
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: CgEditFade, label: "Distribution Approval", link: "/pages/Distribute/DRCAssignManagerApproval2", roles: ["superadmin", "admin"] },
        { icon: CgEditFade, label: "Other Approval", link: "/pages/Distribute/DRCAssignManagerApproval3", roles: ["superadmin", "admin"] },
      ],
    },

    {
      icon: GrConfigure,
      label: "Configuration", 
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: CgEditFade, label: "RTOM List", link: "/dashboard", roles: ["superadmin"] },
        { icon: CgEditFade, label: "Service Type List", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Filter Option", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Arrears Bands and Respective Initial Amounts", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Settlement Plans", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Commission Plans", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Commission Rates", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Negotiation Field Resons", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "MB Field Reasons", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Reqest Type", link: "/dashboard", roles: ["superadmin"] },
        // { icon: CgEditFade, label: "Bonus", link: "/dashboard", roles: ["superadmin"] },
      ],
    },


    {icon: MdDownload, label: "Download", link: "/incident/Incident_File_Download", roles: ["superadmin", "admin", "user"]},
    // {
    //   icon: BiSolidDiamond,
    //   label: "Dummy",
    //   roles: ["superadmin", "admin", "user"],
    //   subItems: [
    //     {
    //       label: "Dummy",
    //       subItems: [
    //         { icon: CgEditFade, label: "Distribute Dummy", link: "/pages/Distribute/DistributeDummy", roles: ["superadmin", "admin"] },
    //         { icon: CgEditFade, label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin", "user"] },
    //       ],
    //     },
    //     { icon: CgEditFade, label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin"] },
    //   ],
    // },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = userRole ? menuItems.filter(item => item.roles.includes(userRole)) : [];

  const handleClick = (level, index, hasSubItems) => {
    const updatedExpandedItems = [...expandedItems];
    if (!hasSubItems) {
      setIsHovered(false);
      onHoverChange(false);
      updatedExpandedItems.splice(0);
    } else {
      if (updatedExpandedItems[level] === index) {
        updatedExpandedItems.splice(level);
      } else {
        updatedExpandedItems[level] = index;
        updatedExpandedItems.splice(level + 1);
      }
    }
    setExpandedItems(updatedExpandedItems);
  };

  const renderSubItems = (subItems, level) => {
    return (
      <ul className={`ml-8 mt-2 space-y-2 ${!isHovered ? "hidden" : ""}`}>
        {subItems.map((subItem, subIndex) => {
          const isExpanded = expandedItems[level] === subIndex;
          const isAccessible = subItem.roles ? subItem.roles.includes(userRole) : true;
          if (isAccessible) {
            return (
              <li key={subIndex}>
                <Link
                  to={subItem.link || "#"}
                  onClick={() => handleClick(level, subIndex, !!subItem.subItems)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  <div className="flex items-center gap-x-2">
                    {subItem.icon ? <subItem.icon className="w-4 h-4 text-white" /> : <CgEditFade className="w-4 h-4 text-white" />}
                    {subItem.label}
                  </div>
                  {subItem.subItems && (isExpanded ? <FaChevronUp className="w-4 h-4 text-white" /> : <FaChevronDown className="w-4 h-4 text-white" />)}
                </Link>
                {isExpanded && subItem.subItems && (
                  <div className="ml-4">
                    {renderSubItems(subItem.subItems, level + 1)}
                  </div>
                )}
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-20 left-4 h-[calc(100%-6rem)] bg-[#1E2659] text-white flex flex-col py-10 transition-all duration-500 shadow-lg rounded-2xl font-poppins overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange(false);
      }}
      style={{ width: isHovered ? "18rem" : "5rem" }}
    >
      <ul className="flex flex-col gap-4 px-4">
        {filteredMenuItems.map((item, index) => {
          const isActive = expandedItems[0] === index;
          return (
            <li key={index}>
              <Link
                to={item.link || "#"}
                onClick={() => handleClick(0, index, !!item.subItems)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium transition ${
                  isActive ? "bg-blue-400 shadow-lg" : "hover:bg-blue-400"
                }`}
              >
                <div className="flex items-center gap-x-4">
                  <item.icon className="w-6 h-6 text-white" />
                  {isHovered && <span>{item.label}</span>}
                </div>
                {item.subItems && (isActive ? <FaChevronUp className="w-4 h-4 text-white" /> : <FaChevronDown className="w-4 h-4 text-white" />)}
              </Link>
              {isActive && item.subItems && (
                <div>{renderSubItems(item.subItems, 1)}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;