// src/components/StatusIcon.jsx
import PropTypes from "prop-types";

const StatusIcon = ({ status }) => {
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "incident open":
                return "/src/assets/images/incidents/Incident_Open.png";
            case "incident reject":
                return "/src/assets/images/incidents/Incident_Reject.png";
            case "incident inprogress":
                return "/src/assets/images/incidents/Incident_InProgress.png";
            default:
                return null;
        }
    };

    const iconPath = getStatusIcon(status);

    if (!iconPath) {
        return <span>{status}</span>;
    }

    return (
        <img
            src={iconPath}
            alt={status}
            className="w-6 h-6"
            title={status}
        />
    );
};

StatusIcon.propTypes = {
    status: PropTypes.string.isRequired,
};

export default StatusIcon;
