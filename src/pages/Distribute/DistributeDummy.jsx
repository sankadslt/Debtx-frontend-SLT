import React from "react";
import { Link } from "react-router-dom";

const DistributeDummy = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Heading  */}
      <h1 style={{ fontSize: "2em", fontWeight: "bold", marginBottom: "10px" }}>
        Distribute Navigation Links
      </h1>

      {/* Navigation links with bold text and aligned layout */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          alignItems: "flex-start", // Align all links to the same vertical point
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        }}
      >
        {[
          
          {
            to: "/pages/Distribute/DistributionPreparationBulkUpload",
            label: "1 . A . 11 - Distribution Preparation Bulk Upload ",
          },
          {
            to: "/pages/Distribute/AssignDRC",
            label: "1 . A . 12 - Assign DRC ",
          },
          {
            to: "/pages/Distribute/AssignedDRCSummary",
            label: "1 . A . 13 - Case Distribution DRC Transactions ",
          },

          {
            to: "/pages/Distribute/DRCAssignManagerApproval",
            label: "1 . 15 - DRC Assign Manager Approval ",
          },
          {
            to: "/pages/Distribute/DistributionPreparationOnlyCPECollect",
            label: "1 . C . 11 - Distribution Preparation (Only CPE Collect) ",
          },
          {
            to: "/pages/Distribute/AssignDRCForCollectCPE",
            label: "1 . C . 12 - Assign DRC For Collect CPE ",
          },
          {
            to: "/pages/Distribute/AssignedDRCSummaryCollectCPE",
            label: "1 . C . 13 - Assigned DRC Summary (Collect CPE) ",
          },
        ].map((link, index) => (
          <Link
            key={index}
            to={link.to}
            style={{
              fontWeight: "bold",
              textAlign: "left",
              textDecoration: "none",
              color: "black",
              padding: "5px",
              marginLeft: "40px",
            }}
            onMouseOver={(e) => (e.target.style.color = "purple")}
            onMouseOut={(e) => (e.target.style.color = "black")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DistributeDummy;
