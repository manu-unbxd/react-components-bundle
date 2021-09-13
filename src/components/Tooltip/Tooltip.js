import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

/* eslint-disable react/prop-types */
const DefaultTooltipActivator = () => {
    return (<Fragment>i</Fragment>);
};

const Tooltip = (props) => {
    const {
        TooltipActivator,
        activatorAction,
        direction,
        children,
        className,
        ...restProps
    } = props;

    const [actionClassName, setActionClassName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    let dirClassName = "RCB-tooltip-right";
    switch(direction) {
        case "bottom":
            dirClassName = "RCB-tooltip-bottom";
            break;
        
        case "left":
            dirClassName = "RCB-tooltip-left";
            break;
        
        case "top":
            dirClassName = "RCB-tooltip-top";
            break;
        
        default:
            dirClassName = "RCB-tooltip-right";
            break;
    }
    
    const showToolTipClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
        setActionClassName("RCB-tooltip-click");
    }

    const showToolTipHover = () => {
        setActionClassName("RCB-tooltip-hover");
        setIsOpen(true);
    }

    const hideToolTip = () => {
        setIsOpen(false);
    }

    const eventProps = (activatorAction === "click") ? { onClick: showToolTipClick } : { onMouseEnter: showToolTipHover, onMouseLeave: hideToolTip };

    return (<div className={`RCB-tooltip ${className}`}>
        <div className="RCB-tooltip-btn" {...eventProps}>
            <TooltipActivator {...restProps}></TooltipActivator>
        </div>
        {isOpen && <div className={`RCB-tooltip-body ${dirClassName} ${actionClassName}`}>
            {children}
        </div>}
    </div>);
};

Tooltip.propTypes = {
    TooltipActivator: PropTypes.func,
    activatorAction: PropTypes.oneOf(["click", "hover"]),
    direction: PropTypes.oneOf(["right", "bottom"])
};

Tooltip.defaultProps = {
    TooltipActivator: DefaultTooltipActivator,
    activatorAction: "hover",
    direction: "right"
};

export default Tooltip;