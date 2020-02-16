import React, { Fragment } from "react";
import PropType from "prop-types";

const DefaultTooltipActivator = () => {
    return (<Fragment>i</Fragment>);
};
  
const Tooltip = (props) => {
    const {
        TooltipActivator,
        children
    } = props;

    return (<div className="RCB-tooltip">
        <div className="RCB-tooltip-btn">
            <TooltipActivator />
        </div>
        <div className="RCB-tooltip-body">
            {children}
        </div>
    </div>);
};

Tooltip.propTypes = {
    TooltipActivator: PropType.element
};

Tooltip.defaultProps = {
    TooltipActivator: DefaultTooltipActivator
};

export default Tooltip;