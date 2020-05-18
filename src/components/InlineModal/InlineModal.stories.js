import React, { Fragment, useState } from "react";
import { linkTo } from "@storybook/addon-links";

import { FRUITS_LIST } from "../../../public/Constants";
import InlineModal, { InlineModalActivator, InlineModalBody } from "./InlineModal";
import { List } from "../";

/* eslint-disable react/prop-types */
const CustomListItem = (props) => {
    const { itemData } = props;
    const { id, name } = itemData;

    return (<li>
        <input type="checkbox" id={id}></input>
        <label htmlFor={id}>{name}</label>
    </li>)
};
/* eslint-enable react/prop-types */

export const SimpleUsage = () => {
    const onModalStateChange = (isModalOpen) => {
        console.log("Modal state change 1");
        console.log({isModalOpen});
    };

    return (<Fragment>
        <InlineModal onModalStateChange={onModalStateChange}>
            <InlineModalActivator>
                <div>Select a fruit</div>
            </InlineModalActivator>
            <InlineModalBody>
                <List items={FRUITS_LIST} showApp={linkTo("List")} ListItem={CustomListItem} />
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
