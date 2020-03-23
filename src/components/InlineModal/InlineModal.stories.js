import React, { Fragment } from "react";
import { linkTo } from "@storybook/addon-links";

import { FRUITS_LIST } from "../../../public/Constants";
import InlineModal, { InlineModalActivator, InlineModalBody } from "./InlineModal";
import { List } from "../";

export const SimpleUsage = () => {
    const onModalStateChange = (isModalOpen) => {
        console.log("Modal state change 1");
        console.log({isModalOpen});
    };

    return (<Fragment>
        <InlineModal onModalStateChange={onModalStateChange}>
            <InlineModalActivator>
                <div>Select</div>
            </InlineModalActivator>
            <InlineModalBody>
                <List items={FRUITS_LIST} showApp={linkTo("List")} />
            </InlineModalBody>
        </InlineModal>
    </Fragment>);
};

SimpleUsage.story = {
    parameters: {
        info: {
            text: "Displaying a dropdown list of items",
        }
    }
};

export default {
    title: "Modals|Inline modal",
    parameters: {
        info: {
            propTables: [InlineModal, InlineModalActivator, InlineModalBody],
            propTablesExclude: [List],
        }
    }
};
