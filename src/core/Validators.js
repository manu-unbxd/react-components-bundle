import utils from "./utils";

const VALIDATORS = {
    EMAIL: (value = "") => {
        const regEx = /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-\\+]+)*@[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-+]+)*(\.[A-Za-z]{2,})$/i;
        return regEx.test(value.trim());
    },
    NUMERIC: (value = "") => {
        const regEx = /^\d+$/;
        const numValue = +value;
        return regEx.test(numValue);
    },
    ALPHA_NUMERIC: (value = "") => {
        const regEx = /^[A-Za-z0-9]+$/;
        return regEx.test(value.trim());
    },
    URL: (value = "") => {
        const regEx = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/i;
        return regEx.test(value.trim());
    },
    REQUIRED: (value) => {
        if ((utils.isArray(value) && value.length == 0)
            || (value !== 0 && !value)) {
            return false;
        }
        return true;
    },
    CUSTOM: (value, validationObj) => {
        const { validator = () => {} } = validationObj;
        return validator.call(null, value, validationObj);
    }
};

export default VALIDATORS;