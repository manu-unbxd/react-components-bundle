import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import List from "../List";

const TabTitleItem = (props) => {
    const { itemData, selected, changeTab, disabled:allDisabled } = props;
    const { id, label, disabled } = itemData;
    const isSelected = id === selected;
    const className = `RCB-tab-title ${isSelected ? "selected" : ""} ${(allDisabled || disabled) ? "RCB-tab-disabled" : ""}`;

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
    changeTab: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

const TabsComponent = (props) => {
    const { className, items, selectedTab, onTabChange, onTabChanged, appearance, disabled, staticTabContent } = props;
    const getSelected = () => disabled ? "" : defaultSelected;
    const defaultSelected = selectedTab || (items[0] ? items[0].id : "");
    const [ selected, setSelected ] = useState(getSelected());
    const appearanceClassName = `RCB-tabs-${appearance.toLowerCase()}`;

    useEffect(() => {
        setSelected(getSelected());
    }, [disabled]);

    const changeTab = (id) => {
        const changeTab = onTabChange(id);

        if (changeTab) {
            setSelected(id);
            if (typeof(onTabChanged) === "function") {
                onTabChanged(id);
            }
        }
    };

    const selecetdTabData = items.find(obj => obj.id === selected);
    const { bodyComponent } = selecetdTabData || {};

    return (<div className={`RCB-tabs-container ${appearanceClassName} ${className}`}>
        <List items={items} ListItem={TabTitleItem} selected={selected} disabled={disabled} changeTab={changeTab} className="RCB-tabs-header" />
        <div className="RCB-tab-content">
            {staticTabContent || bodyComponent}
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
    /**  Function called when a tab change has been triggerd by the user, 
     * return false if you want to stop the tab change action */
    onTabChange: PropTypes.func,
    /**  Function called when a tab change action has been completed */
    onTabChanged: PropTypes.func,
    /** disable all tabs */
    disabled: PropTypes.bool,
    /** if you want to show a static tab content in disabled state (i.e. "disabled=true"), pass it in this prop */
    staticTabContent: PropTypes.any
};

TabsComponent.defaultProps = {
    className: "",
    appearance: "HORIZONTAL",
    disabled: false,
    onTabChange: () => true
};

export default TabsComponent;