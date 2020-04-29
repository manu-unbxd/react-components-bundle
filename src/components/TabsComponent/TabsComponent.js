import React, { useState } from "react";
import PropTypes from "prop-types";
import List from "../List";

const TabTitleItem = (props) => {
    const { itemData, selected, changeTab } = props;
    const { id, label, disabled } = itemData;
    const isSelected = id === selected;
    const className = `RCB-tab-title ${isSelected ? "selected" : ""} ${disabled ? "RCB-tab-disabled" : ""}`;

    const triggerTabChange = () => {
        changeTab(id);
    };

    return (<li className={className} selected={isSelected} onClick={triggerTabChange}>
        {label}
    </li>);
};

TabTitleItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.any.isRequired,
        disabled: PropTypes.bool
    }).isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeTab: PropTypes.func.isRequired
};

const TabsComponent = (props) => {
    const { className, items, selectedTab, onTabChanged, appearance } = props;
    const defaultSelected = selectedTab || (items[0] ? items[0].id : "");
    const [ selected, setSelected ] = useState(defaultSelected);
    const appearanceClassName = `RCB-tabs-${appearance.toLowerCase()}`;

    const changeTab = (id) => {
        setSelected(id);
        if (typeof(onTabChanged) === "function") {
            onTabChanged(id);
        }
    };

    const selecetdTabData = items.find(obj => obj.id === selected);
    const { bodyComponent } = selecetdTabData;

    return (<div className={`RCB-tabs-container ${appearanceClassName} ${className}`}>
        <List items={items} ListItem={TabTitleItem} selected={selected} changeTab={changeTab} className="RCB-tabs-header" />
        <div className="RCB-tab-content">
            {bodyComponent}
        </div>
    </div>)
};

TabsComponent.propTypes = {
    /** Pass any additional classNames to Tabs component */
    className: PropTypes.string,
    /** Array of tab items. Each object in array should contain {id, label, bodyComponent: <Component />, disabled} */
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.any.isRequired,
        bodyComponent: PropTypes.instanceOf(Object),
        disabled: PropTypes.bool
    })).isRequired,
    /** ID of the tab item to be selected */
    selectedTab: PropTypes.string,
    /** Horizontal or vertical tabs */
    appearance: PropTypes.oneOf(["HORIZONTAL", "VERTICAL"]),
    onTabChanged: PropTypes.func
};

TabsComponent.defaultProps = {
    className: "",
    appearance: "HORIZONTAL"
};

export default TabsComponent;