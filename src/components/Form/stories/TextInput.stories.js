import React, { Fragment, useRef } from "react";
import Form from "../Form";
import Input from "../Input";
import Button, { ButtonAppearance } from "../../Button";

export const TextInput = () => {
    const onSubmit = formData => {
        const { data, errors = {} } = formData;

        if (Object.keys(errors).length) {
            console.log("ERRORS FOUND : ");
            console.log(errors);
        } else {
            console.log("Submitted data: ", data);
        }
    };

    return (
        <Form onSubmit={onSubmit}>
        <Input
            type="text"
            name="email"
            label="Name"
            placeholder="Enter your email"
            appearance="block"
            validations={[
            {
                type: "EMAIL",
                message: "Please enter a valid email address",
            },
            ]}
        />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
            Submit
        </Button>
        </Form>
    );
};

TextInput.story = {
    parameters: {
        info: {
            propTables: [Input]
        }
    },
};

export const RefUsage = () => {
    const inputRef = useRef();

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <Fragment>
            <Button appearance={ButtonAppearance.SECONDARY} className="full-width-btn" onClick={focusInput}>Focus input</Button>
            <Input
                ref={inputRef}
                type="text"
                name="email"
                label="Name"
                placeholder="Enter your email"
                appearance="block"
            />
        </Fragment>
    );
};

export default {
    title: "Form|Text Input",
    parameters: {
        info: {
            propTables: [TextInput]
        }
    }
};