import React, { useState, useContext, useEffect } from "react";
import { useDidUpdateEffect } from "../../core/customHooks";
import { FormContext } from "./Form";
import FormElementWrapper from "./FormElementWrapper";
import PropTypes from "prop-types";
  
const Toggle = (props) => {
    const { name, label, value, defaultValue, className, appearance, toggleElWidth, toggleKnobSize, onChange } = props;
    const initialValue = typeof(onChange) === "function" ? value : defaultValue;
    const [ isActive, setIsActive ] = useState(initialValue);
    const { onValueChange } = useContext(FormContext);

    const toggleActive = () => {
        setIsActive(!isActive);       
    };

    const postFormValueChange = (value) => {
        typeof(onValueChange) === "function" && onValueChange(name, value);
    };

    useDidUpdateEffect(() => {
        /* runs only when isActive changes, hence call the onChange function then */
        const value = isActive;
        if (typeof(onChange) === "function") {
            onChange(value);
        }

        postFormValueChange(value);
    }, [isActive]);

    useEffect(() => {
        /* set the initial form element value in the form context */
        const postValue = typeof(onChange) === "function" ? value : defaultValue;
        postFormValueChange(postValue);
    }, [value, defaultValue]);

    let toggleElCSS = {
        width: `${toggleElWidth}px`
    };

    let toggleKnobCSS = {
        width: `${toggleKnobSize}px`,
        height: `${toggleKnobSize}px`
    };

    if (isActive) {
        toggleKnobCSS.transform = `translateX(${toggleElWidth - toggleKnobSize}px)`;
    }

    return (<FormElementWrapper className={className} appearance={appearance}>
        <label className="RCB-form-el-label" htmlFor={name}>{label}</label>
        <div className={`RCB-form-el RCB-toggle ${isActive ? "active" : ""}`} 
            onClick={toggleActive} style={toggleElCSS}>
            <div className="RCB-toggle-knob" style={toggleKnobCSS}></div>
        </div>
    </FormElementWrapper>);
};

Toggle.propTypes = {
    /** Pass any additional classNames to Input component */
    className: PropTypes.string,
    /** Label for the input element */
    label: PropTypes.string,
    /** Unique ID for the input element */
    name: PropTypes.string.isRequired,
    /** Will be used only with onChange function, or else ignored */
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    /** Define the appearance of the form element. Accepted values are either "inline" or "block" */
    appearance: PropTypes.oneOf(["inline", "block"]),
    /** Becomes a controlled component if onChange function is given */
    onChange: PropTypes.func,
    /** width of the toggle element in pixels */
    toggleElWidth: PropTypes.number,
    /** size of the toggle inner knob in pixels */
    toggleKnobSize: PropTypes.number
};

Toggle.defaultProps = {
    className: "",
    appearance: "inline",
    toggleElWidth: 40,
    toggleKnobSize: 13
};

export default Toggle;