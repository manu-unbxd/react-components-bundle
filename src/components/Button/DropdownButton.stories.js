import React, { useState } from "react";
import { Fragment } from "react";
import DropdownButton from "./DropdownButton";

const DROPDOWN_OPTIONS = [{
    id: "PrintApple",
    name: "Print Apple",
    message: "Apple"
}, {
    id: "PrintMango",
    name: "Print Mango",
    message: "Mango"
}, {
    id: "PrintGrapes",
    name: "Print Grapes",
    message: "Grapes"
}];

export const DefaultDropdownButton = () => {
    const [ message, setMessage ] = useState();

    const printMessage = (data) => {
        const { message } = data;
        setMessage(message);
    };

    return (<Fragment>
        <DropdownButton 
            label="Actions" 
            options={DROPDOWN_OPTIONS} 
            onClick={printMessage} />
        <div>{`Message is ${message}`}</div>
    </Fragment>);
};

export default {
    title: "Dropdown Button"
};
