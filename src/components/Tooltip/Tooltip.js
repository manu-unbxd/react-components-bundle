import React, { Fragment } from "react";
import PropType from "prop-types";

const DefaultTooltipActivator = () => {
    return (<Fragment>i</Fragment>);
};
  
const Tooltip = (props) => {
    const {
        tooltipActivator,
        children
    } = props;

    return (<div className="RCB-tooltip">
        <div className="RCB-tooltip-btn">
            {tooltipActivator}
        </div>
        <div className="RCB-tooltip-body">
            {children}
        </div>
    </div>);
};

Tooltip.propTypes = {
    tooltipActivator: PropType.element
};

Tooltip.defaultProps = {
    tooltipActivator: <DefaultTooltipActivator />
};

export default Tooltip;