import React, { useState, createContext, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";

export const FormContext = createContext({
    onValueChange: () => {}
});

let Form = (props, ref) => {
    const [ formData, setFormData ] = useState({});
    const [ formErrors, setFormErrors ] = useState({});
    const { className, onSubmit } = props;

    const getFormData = () => {
        return { data: formData, errors: formErrors };
    };

    /* add methods that can be accessed via this component's ref */
    useImperativeHandle(ref, () => ({
        getFormData: getFormData
    }));

    const onValueChange = (key, value, error) => {
        formData[key] = value;
        setFormData(formData);
        
        if (error) {
            formErrors[key] = error;
        } else {
            /* remove the error value */
            delete formErrors[key];
        }

        setFormErrors(formErrors);
    };

    const onFormSubmit = (event) => {
        event.preventDefault();
        onSubmit(getFormData());
    }

    return (<form onSubmit={onFormSubmit} className={className}>
        <FormContext.Provider value={{onValueChange: onValueChange}}>
            {props.children}
        </FormContext.Provider>
    </form>);
};

Form = forwardRef(Form);

Form.propTypes = {
    /** Pass any additional classNames to Form component */
    className: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};

Form.defaultProps = {
    className: ""
};

export default Form;