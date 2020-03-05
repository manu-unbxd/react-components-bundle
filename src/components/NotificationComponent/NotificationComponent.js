import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const NotificationComponent = (props) => {
    const [ hideMessage, setHideMessage ] = useState(false);
    const { appearance, children, messageId, fadeOut, fadeOutTime, className } = props;
    let fadeOutMessage = typeof(fadeOut) !== "undefined" ? fadeOut : appearance === "success";
    let timerID;

    const clearMessage = () => {
        setHideMessage(true);
    };

    const setClearMessageTimeout = () => {
        if (fadeOutMessage) {
            timerID && clearTimeout(timerID);
            timerID = setTimeout(clearMessage, fadeOutTime);
        }
    }

    useEffect(() => {
        /* RUN ONCE */
        setClearMessageTimeout();
    }, []);

    useEffect(() => {
        /* RUN when message ID changes */
        setHideMessage(false);
        setClearMessageTimeout();
    }, [messageId]);

    if (hideMessage) {
        return null;
    } else {
        return (<div className={`RCB-notif RCB-notif-${appearance} ${className}`}>{children}</div>);
    }
};

NotificationComponent.propTypes = {
    /** Pass any additional classNames to Notification component */
    className: PropTypes.string,
    /* Unique ID to represent this particular message */
    messageId: PropTypes.number,
    /* Appearance of the notification message */
    appearance: PropTypes.oneOf(["error", "warning", "success", "info"]),
    /* Should the message fadeout after (fadeOutTime)ms or not. Default true for success messages only. */
    fadeOut: PropTypes.bool,
    /* fadeout timer, in milliseconds */
    fadeOutTime: PropTypes.number
};

NotificationComponent.defaultProps = {
    className: "",
    appearance: "success",
    fadeOutTime: 3000
};

export default NotificationComponent;