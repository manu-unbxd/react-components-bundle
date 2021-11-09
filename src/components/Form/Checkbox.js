import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form";
import FormElementWrapper from "./FormElementWrapper";
  
const Checkbox = (props) => {
    const { label, name, className, value, defaultValue, appearance, onChange, ...restProps } = props;
    const { onValueChange } = useContext(FormContext);

    const postFormValueChange = (value) => {
        typeof(onValueChange) === "function" && onValueChange(name, value);
    };

    const onInputChange = (event) => {
        const value = event.target.checked;

        if (typeof(onChange) === "function") {
            onChange(value);
        }

        postFormValueChange(value);
    }

    useEffect(() => {
        /* set the initial form element value in the form context */
        const postValue = typeof(onChange) === "function" ? value : defaultValue;
        postFormValueChange(postValue);
    }, [value, defaultValue]);

    let inputProps = {
        type: "checkbox",
        label,
        name,
        id: name,
        defaultChecked: defaultValue,
        className: "RCB-form-el",
        onChange: onInputChange,
        ...restProps
    };

    if (typeof(onChange) === "function") {
        /* make it a controlled component if onChange function is given */
        inputProps.checked = value;
    }

    return (<FormElementWrapper className={className} appearance={appearance}>
        <input {...inputProps} />
        <label className="RCB-form-el-label" htmlFor={name}>{label}</label>
    </FormElementWrapper>);
};

Checkbox.propTypes = {
    /** Pass any additional classNames to Input component */
    className: PropTypes.string,
    /** Label for the input element */
    label: PropTypes.string,
    /** Unique ID for the input element */
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Will be used only with onChange function, or else ignored */
    value: PropTypes.bool,
    defaultValue: PropTypes.bool,
    /** Define the appearance of the form element. Accepted values are either "inline" or "block" */
    appearance: PropTypes.oneOf(["inline", "block"]),
    /** Becomes a controlled component if onChange function is given */
    onChange: PropTypes.func
};

Checkbox.defaultProps = {
    className: "",
    appearance: "inline"
};

export default Checkbox;