import React, { useState, useRef, createContext, useImperativeHandle, forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import dequal from "dequal";
import cloneDeep from "lodash.clonedeep";

export const FormContext = createContext({
    onValueChange: () => {}
});

let Form = (props, ref) => {
    const [ formData, setFormData ] = useState({});
    const [ formErrors, setFormErrors ] = useState({});
    const [ formRefreshCount, setFormRefreshCount ] = useState(0);
    const { className, onChange, onSubmit } = props;
    const dataRef = useRef();

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
        setFormRefreshCount(formRefreshCount + 1);
    };

    const onFormSubmit = (event) => {
        event.preventDefault();
        onSubmit(getFormData());
    }

    useEffect(() => {
        /* 
            As useEffect does not do a deep comparision on dependent props, 
            do a manual deep comparision to decide whether data changed
        */
        if (typeof(onChange) === "function") {
            const formData = getFormData();

            if (!dequal(formData, dataRef.current)) {
                dataRef.current = cloneDeep(formData);
                onChange(formData);
            }
        }
    }, [formRefreshCount]);

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
    /** Pass a callback function to listen to changes on any of the form elements */
    onChange: PropTypes.func,
    /** Pass a callback function to listen to form submit event */
    onSubmit: PropTypes.func
};

Form.defaultProps = {
    className: ""
};

export default Form;