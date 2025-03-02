import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosListBox } from "react-icons/io";
import { MdSpeakerNotes } from "react-icons/md";
import { GoDot } from "react-icons/go";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../services/auth/authService";

const Sidebar = ({ onHoverChange }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Load user role from accessToken
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
    { icon: MdSpaceDashboard, label: "Dashboard", link: "/dashboard", roles: ["superadmin", "admin", "user"], subItems: [] },

    {
      icon: IoIosListBox,
      label: "User List",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: GoDot, label: "SLT Staff", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "DRC List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "RO List", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },

    { icon: MdSpaceDashboard, 
      label: "Incident List", 
      roles: ["superadmin", "admin", "user"], 
      subItems: [
        { icon: GoDot, label: "Incident List", link: "/Distribution/filtered-incident", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Filtered Incidents", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Bulk Upload Log", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Rejected incident log", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },

    { icon: MdSpeakerNotes, label: "Distribution", link: "/pages/Distribute/DistributionPreparationBulkUpload", roles: ["superadmin", "admin", "user"], subItems: [] },

    {
      icon: IoIosListBox,
      label: "Case Lisr",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: GoDot, label: "Case List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, 
          label: "RO Assigned Case List", 
          roles: ["superadmin", "admin"], 
          subItems: [
            {icon:GoDot, label:"Negotiation Case List", link:"/dashboard", roles:["superadmin", "admin"]},
            {icon:GoDot, label:"Medeation Board List", link:"/dashboard", roles:["superadmin", "admin"]},
          ],
        },
        { icon: GoDot, label: "FTL LOD Case List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Digital Signature Case List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Litigation Case List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Dispute Case List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, 
          label: "Disposed Case List", 
          roles: ["superadmin", "admin"],
          subItems: [
            {icon:GoDot, label:"Write off List", link:"/dashboard", roles:["superadmin", "admin"]},
            {icon:GoDot, label:"Abandoned List", link:"/dashboard", roles:["superadmin", "admin"]},
            {icon:GoDot, label:"Withdraw List", link:"/dashboard", roles:["superadmin", "admin"]},
            {icon:GoDot, label:"Closed List", link:"/dashboard", roles:["superadmin", "admin"]},
          ],
        },
      ],
    },

    {icon: MdSpaceDashboard, label: "Settlement", link: "/dashboard", roles: ["superadmin", "admin", "user"]},
    {icon: MdSpaceDashboard, label: "Request List", link: "/dashboard", roles: ["superadmin", "admin", "user"]},
    {
      icon: MdSpaceDashboard, 
      label: "Approvals", 
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: GoDot, label: "Distribution Approval", link: "/dashboard", roles: ["superadmin", "admin"] },
        { icon: GoDot, label: "Other Approval", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },

    {
      icon: MdSpaceDashboard,
      label: "Configuration", 
      roles: ["superadmin", "admin", "user"],
      subItems: [
        { icon: GoDot, label: "RTOM List", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Service Type List", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Filter Option", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Arrears Bands and Respective Initial Amounts", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Settlement Plans", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Commission Plans", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Commission Rates", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Negotiation Field Resons", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "MB Field Reasons", link: "/dashboard", roles: ["superadmin"] },
        { icon: GoDot, label: "Reqest Type", link: "/dashboard", roles: ["superadmin"] },
      ],
    },

    {
      icon: IoIosListBox,
      label: "Dummy",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        {
          label: "Dummy",
          subItems: [
            { icon: GoDot, label: "Distribute Dummy", link: "/pages/Distribute/DistributeDummy", roles: ["superadmin", "admin"] },
            { icon: GoDot, label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin", "user"] },
          ],
        },
        { icon: GoDot, label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = userRole ? menuItems.filter(item => item.roles.includes(userRole)) : [];

  // Handle submenu toggle on click
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

  // Find the active path based on the current route
  const findActivePath = (items, path) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].link === path) return [i];
      if (items[i].subItems) {
        const subPath = findActivePath(items[i].subItems, path);
        if (subPath) return [i, ...subPath];
      }
    }
    return null;
  };

  const activePath = findActivePath(menuItems, location.pathname);

  // Render subitems recursively
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
                  className="flex items-center gap-x-2 px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  {subItem.icon ? <subItem.icon className="w-4 h-4 text-white" /> : <GoDot className="w-4 h-4 text-white" />}
                  {subItem.label}
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
      className={`fixed top-20 left-4 h-[calc(100%-6rem)] bg-[#095FAA] text-white flex flex-col py-10 transition-all duration-500 shadow-lg rounded-2xl font-poppins`}
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
          const isActive = activePath && activePath[0] === index;
          return (
            <li key={index}>
              <Link
                to={item.link || "#"}
                onClick={() => handleClick(0, index, !!item.subItems)}
                className={`flex items-center gap-x-4 px-3 py-2 rounded-lg text-base font-medium transition ${
                  isActive ? "bg-blue-400 shadow-lg" : "hover:bg-blue-400"
                }`}
              >
                <item.icon className="w-6 h-6 text-white" />
                {isHovered && <span>{item.label}</span>}
              </Link>
              {expandedItems[0] === index && item.subItems && (
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