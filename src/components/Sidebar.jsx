import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosListBox } from "react-icons/io";
import {MdSpeakerNotes} from "react-icons/md"
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
    //dashboard
    { icon: MdSpaceDashboard, label: "Dashboard", link: "/dashboard", roles: ["superadmin", "admin", "user"], subItems: [] },


    //userList
    {
      icon: IoIosListBox,
      label: "User List",
      roles: ["superadmin", "admin", "user"],
      subItems: [
       
        { label: "SLT Staff", link: "/dashboard", roles: ["superadmin", "admin"] },
        { label: "DRC List", link: "/dashboard", roles: ["superadmin", "admin"] },
        { label: "RO List", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },

    //filterincident
    { icon: MdSpaceDashboard, label: "Filter Incident", link: "/Distribution/filtered-incident", roles: ["superadmin", "admin", "user"], subItems: [] },

    //Distribute
    { icon: MdSpeakerNotes, label: " Distribution", link: "/pages/Distribute/DistributionPreparationBulkUpload", roles: ["superadmin", "admin", "user"], subItems: [] },

    //sample
    {
      icon: IoIosListBox,
      label: "Dummy",
      roles: ["superadmin", "admin", "user"],
      subItems: [
        {
          label: "Dummy",
          subItems: [
            { label: "Distribte Dummy", link: "/pages/Distribute/DistributeDummy", roles: ["superadmin", "admin"] },
            { label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin", "user"] },
          ],
        },
        { label: "Dummy", link: "/dashboard", roles: ["superadmin", "admin"] },
      ],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = userRole ? menuItems.filter(item => item.roles.includes(userRole)) : [];

  // Handle submenu toggle on click
  const handleClick = (level, index, hasSubItems) => {
    const updatedExpandedItems = [...expandedItems];

    // Collapse all submenus if clicking a link
    if (!hasSubItems) {
      setIsHovered(false);
      onHoverChange(false);
      updatedExpandedItems.splice(0);
    } else {
      // Toggle submenu on click if it has subitems
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

  // Find the active path to highlight the correct menu item
  const activePath = findActivePath(menuItems, location.pathname);

  // Render subitems recursively
  const renderSubItems = (subItems, level) => {
    return (
      <ul className={`ml-8 mt-2 space-y-2 ${!isHovered ? "hidden" : ""}`}>
        {subItems.map((subItem, subIndex) => {
          const isExpanded = expandedItems[level] === subIndex;

          // Check if user role allows access to subItem
          const isAccessible = subItem.roles ? subItem.roles.includes(userRole) : true;

          // If subItem is accessible, render it
          if (isAccessible) {
            return (
              <li key={subIndex}>
                <Link
                  to={subItem.link || "#"}
                  onClick={() => handleClick(level, subIndex, !!subItem.subItems)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition"
                >
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

          // If not accessible, do not render
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
      {/* Menu Items */}
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
                <item.icon
                  className={`w-6 h-6 ${
                    isActive ? "text-white" : "text-white"
                  }`} // Change the icon color for active item
                />
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