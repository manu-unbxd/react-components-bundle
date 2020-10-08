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
        ...restProps
    } = props;

    const [actionClassName, setActionClassName] = useState("");
    const [isOpen,setIsOpen] = useState(false);

    let dirClassName = "RCB-tooltip-right";
    if (direction === "bottom") {
        dirClassName = "RCB-tooltip-bottom"
    }

    const showToolTipClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
        setActionClassName("RCB-tooltip-click");
    }

    const showToolTipHover = () => {
        setActionClassName("RCB-tooltip-hover");
    }

    const hideToolTip = () => {
        setActionClassName("");
    }
    
    return (<div className="RCB-tooltip">
        { activatorAction === "click" ? 
            (
                <div className="RCB-tooltip-btn" onClick={showToolTipClick}>
                    <TooltipActivator {...restProps}></TooltipActivator>
                </div>
            ) : 
            (
                <div className="RCB-tooltip-btn" onMouseEnter={showToolTipHover} onMouseLeave={hideToolTip}>
                    <TooltipActivator {...restProps}></TooltipActivator>
                </div>
            )
        }
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