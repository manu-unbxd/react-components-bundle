import React from "react";
import PropTypes from "prop-types";

/** ButtonAppearance enum */
export const ButtonAppearance = {
    DEFAULT: "default",
    PRIMARY: "primary",
    SECONDARY: "secondary"
};

/** ButtonSize enum */
export const ButtonSize = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large"
};

/**
 * 
 * Displays a Button component 
 */
const Button = (props) => {
    const { children, className, loading, disabled, appearance, size, onClick, ...restProps } = props;
    const btnClassName = `RCB-btn RCB-btn-${appearance} RCB-btn-${size} ${className}` + (loading ? " RCB-btn-loading" : "");

    return (<button className={btnClassName} disabled={disabled} onClick={onClick} {...restProps}>
        {children}
    </button>);
};

Button.propTypes = {
    /** Add any additional classes to Button component */
    className: PropTypes.string,
    /** Boolean indicating whether the button should render as disabled */
    disabled: PropTypes.bool,
    /** Boolean indicating whether the button is in loading state */
    loading: PropTypes.bool,
    /** String indicating how Button should be rendered. 
     * Must be one of,
     * ButtonAppearance = {
        DEFAULT: "default",
        PRIMARY: "primary",
        SECONDARY: "secondary"
       }   
    */
    appearance: PropTypes.oneOf(Object.values(ButtonAppearance)),
    /** String indicating the size of the Button
     * Must be one of,
     * ButtonSize = {
        SMALL: "small",
        MEDIUM: "medium",
        LARGE: "large"
    }
    */
    size: PropTypes.oneOf(Object.values(ButtonSize)),
    /** Button onClick handler */
    onClick: PropTypes.func
};

Button.defaultProps = {
    onClick: () => {},
    appearance: ButtonAppearance.DEFAULT,
    size: ButtonSize.SMALL,
    className: ""
};

export default Button;

