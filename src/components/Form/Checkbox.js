import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form";
import FormElementWrapper from "./FormElementWrapper";
  
const Checkbox = (props) => {
    const { label, name, className, value, defaultValue, appearance, onChange } = props;
    const { onValueChange } = useContext(FormContext);

    const onInputChange = (event) => {
        const value = event.target.checked;

        // TODO : do validations

        if (typeof(onChange) === "function") {
            onChange(value);
        }

        typeof(onValueChange) === "function" && onValueChange(name, value);
    }

    let inputProps = {
        type: "checkbox",
        label,
        name,
        id: name,
        defaultChecked: defaultValue,
        className: "RCB-form-el",
        onChange: onInputChange
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
    name: PropTypes.string.isRequired,
    /** Will be used only with onChange function, or else ignored */
    value: PropTypes.any,
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