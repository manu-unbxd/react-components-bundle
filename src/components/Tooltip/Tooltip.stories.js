import React from "react";
import Tooltip from "./Tooltip";

const CustomActivator = () => {
    return <span>Hover over me</span>;
}

export const SimpleUsage = () => {
    return (<Tooltip tooltipActivator={<CustomActivator />}>
        <img src="https://cdn1.iconfinder.com/data/icons/hawcons/32/700231-icon-61-warning-512.png" width={20}/>This is a sample tooltip
    </Tooltip>);
};

export default {
    title: "Tooltip",
};