import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form";
import FormElementWrapper from "./FormElementWrapper";

const RangeSlider = (props) => {
    const { label, name, min, max, className, value, defaultValue, appearance, onChange, disabled, bubble, inputStyle = {}, ...restProps } = props;
    const { onValueChange } = useContext(FormContext);
    const [ val, setVal ] = useState(value || defaultValue);
    
    const postFormValueChange = (value) => {
        typeof(onValueChange) === "function" && onValueChange(name, value);
    };

    const getPercent = (value) => {
        const percent = (value/max)*100;
        return percent;
    }

    const getBubbleStyle = (value) => {
        const percent = getPercent(value);
        return {left: `calc(${percent}% - 10px)`};
    }

    const [ bubbleStyle, setBubbleStyle ] = useState(getBubbleStyle((value || defaultValue)));

    const onInputChange = (event) => {
        const value = event.target.value;

        // TODO : do validations

        if (typeof(onChange) === "function") {
            onChange(value);
        }

        postFormValueChange(value);
        setVal(value);
        bubble ? setBubbleStyle(getBubbleStyle(value)) : "";
    }

    useEffect(() => {
        /* set the initial form element value in the form context */
        const postValue = typeof(onChange) === "function" ? value : defaultValue;
        postFormValueChange(postValue);
    }, [value, defaultValue]);

    let inputProps = {
        type: "range",
        min,
        max,
        label,
        name,
        id: name,
        defaultValue,
        disabled,
        className: `RCB-form-el RCB-input-range ${className}`,
        onChange: onInputChange,
        ...restProps,
        bubble
    };

    if (typeof(onChange) === "function") {
        /* make it a controlled component if onChange function is given */
        inputProps.value = value;
    }


    return (<FormElementWrapper className={className} appearance={appearance}>
        <label className="RCB-form-el-label" htmlFor={name}>{label}</label>
        <div className="RCB-range-wrapper">
            { bubble && <div className="RCB-range-value" style={bubbleStyle}><span>{val}</span></div>}
            <input {...inputProps} style={inputStyle} disabled={disabled}/>
        </div>
    </FormElementWrapper>);
};

RangeSlider.propTypes = {
    /** Pass any additional classNames to Input component */
    className: PropTypes.string,
    /** Minimum value for range slider */
    min: PropTypes.string.isRequired,
    /** Maximum value for range slider */
    max: PropTypes.string.isRequired,
    /** Label for the input element */
    label: PropTypes.string,
    /** Unique ID for the input element */
    name: PropTypes.string.isRequired,
    /** Will be used only with onChange function, or else ignored */
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    /** Define the appearance of the form element. Accepted values are either "inline" or "block" */
    appearance: PropTypes.oneOf(["inline", "block"]),
    /** Becomes a controlled component if onChange function is given */
    onChange: PropTypes.func,
    /** Custom Style changes of slider track */
    inputStyle: PropTypes.object,
    /** Show bubble with values */
    bubble: PropTypes.bool
};

RangeSlider.defaultProps = {
    className: "",
    appearance: "inline"
};

export default RangeSlider;