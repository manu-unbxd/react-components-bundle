import React, { useState, useContext, useRef, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import InlineModal, { InlineModalActivator, InlineModalBody } from "../InlineModal";
import List from "../List";
import { FormContext } from "./Form";
import FormElementWrapper from "./FormElementWrapper";

/* eslint-disable react/prop-types */
const DefaultSelectionSummary = ({selectedItems = [], multiSelect, noSelectionLabel, nameAttribute}) => {
    let summaryString = "";
    const selectedCount = selectedItems.length;

    if (multiSelect) {
        summaryString = selectedCount ? `${selectedCount} selected` : noSelectionLabel; 
    } else {
        summaryString = selectedCount ? selectedItems[0][nameAttribute] : noSelectionLabel;
    }

    return (<Fragment><span>{summaryString}</span><span className="RCB-select-arrow"></span></Fragment>);
};

/* eslint-enable react/prop-types */

export const DefaultDropdownItem = (props) => {
    const { itemData, selectItem, selectedItems = [], idAttribute, nameAttribute } = props;
    const idValue = itemData[idAttribute];
    const name = itemData[nameAttribute];

    const isSelected = selectedItems.find(obj => obj[idAttribute] === idValue) ? true : false;
    const className = "RCB-list-item " + (isSelected ? "selected" : "");

    return (<li onClick={() => selectItem(itemData)} className={className}>
        {name}
    </li>);
};

DefaultDropdownItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    selectItem: PropTypes.func.isRequired,
    selectedItems: PropTypes.array,
    idAttribute: PropTypes.string,
    nameAttribute: PropTypes.string
};

const convertToArray = (value) => {
    return Array.isArray(value) ? value : [value];
};

const Dropdown = (props) => {
    const { 
        halign,
        label,
        showLabel, 
        name,
        SelectionSummary, 
        className, 
        value, 
        defaultValue,
        onChange, 
        options, 
        idAttribute,
        nameAttribute,
        noSelectionLabel,
        appearance,
        multiSelect,
        DropdownItem 
    } = props;

    let initialSelected = [];
    const initialValue = typeof(onChange) === "function" ? value : defaultValue
    
    if (typeof(initialValue) !== "undefined") {
        initialSelected = convertToArray(initialValue);
    }
    
    /* array of selected item objects */
    let [ selectedItems, setSelectedItems ] = useState(initialSelected);

    const { onValueChange } = useContext(FormContext);
    const inlineModalRef = useRef();

    const postFormValueChange = (value) => {
        typeof(onValueChange) === "function" && onValueChange(name, value);
    };

    const selectItem = (item) => {
        const id = item[idAttribute];

        if (multiSelect) {
            const isPresent = selectedItems.find(obj => obj[idAttribute] === id);
            if (!isPresent) {
                selectedItems.push(item);
                postFormValueChange(selectedItems);
                typeof(onChange) === "function" && onChange(selectedItems);
            }
        } else {
            selectedItems = [item];
            postFormValueChange(item);
            typeof(onChange) === "function" && onChange(item);
            /* close the dropdown */
            inlineModalRef.current.hideModal();
        }

        setSelectedItems(selectedItems);
    }

    useEffect(() => {
        /* set the initial form element value in the form context */
        let postValue = typeof(onChange) === "function" ? value : defaultValue;
        postValue = multiSelect ? convertToArray(postValue) : postValue
        postFormValueChange(postValue);
    }, [value, defaultValue]);

    // TODO : add search feature

    return (<FormElementWrapper className={`RCB-dropdown ${className}`} appearance={appearance}>
        {showLabel && <label className="RCB-form-el-label" htmlFor={name}>{label}</label>}
        <InlineModal className="RCB-form-el" ref={inlineModalRef} halign={halign}>
            <InlineModalActivator>
                <SelectionSummary 
                    selectedItems={selectedItems}
                    noSelectionLabel={noSelectionLabel}
                    multiSelect={multiSelect} nameAttribute={nameAttribute} />
            </InlineModalActivator>
            <InlineModalBody>
                <List items={options} ListItem={DropdownItem} selectedItems={selectedItems} selectItem={selectItem} idAttribute={idAttribute} nameAttribute={nameAttribute} />
            </InlineModalBody>
        </InlineModal>
    </FormElementWrapper>);
};

const VALUE_SHAPE = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
});

Dropdown.propTypes = {
    /** Pass any additional classNames to Dropdown component */
    className: PropTypes.string,
    /** Horizontal alignment of the dropdown body */
    halign: PropTypes.oneOf(["left", "right"]),
    /** Label for the dropdown element */
    label: PropTypes.string,
    /** indicates whether to show or hide label */
    showLabel: PropTypes.bool,
    /** Unique ID for the input element */
    name: PropTypes.string.isRequired,
    /** Label for dropdown activator */
    noSelectionLabel: PropTypes.string,
    /** Selection items list */
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string
    })),
    /** array of selected item objects, only considered if onChange event is given */
    value: PropTypes.oneOf([VALUE_SHAPE, PropTypes.arrayOf(VALUE_SHAPE), ""]),
    /** array of default selected item objects */
    defaultValue: PropTypes.oneOf([VALUE_SHAPE, PropTypes.arrayOf(VALUE_SHAPE), ""]),
    onChange: PropTypes.func,
    /** Is dropdown multi select or single select */
    multiSelect: PropTypes.bool,
    /** ID attribute key to use when rendering the dropdown items, if the ID attribute is other than "id" */
    idAttribute: PropTypes.string,
    /** name attribute key to use when rendering the dropdown items, if the name attribute is other than "name" */
    nameAttribute: PropTypes.string,
    /** Provide a custom element for rendering dropdown item */
    DropdownItem: PropTypes.oneOfType([
        PropTypes.instanceOf(Element),
        PropTypes.func
    ]),
    /** Pass this component to customise the selection summary HTML. 
     * The array of selected item objects will be sent as props
     */
    SelectionSummary: PropTypes.func,
    /** Define the appearance of the form element. Accepted values are either "inline" or "block" */
    appearance: PropTypes.oneOf(["inline", "block"])
};

Dropdown.defaultProps = {
    className: "",
    label: "",
    showLabel: true,
    multiSelect: false,
    idAttribute: "id",
    nameAttribute: "name",
    noSelectionLabel: "Select",
    appearance: "inline",
    DropdownItem: DefaultDropdownItem,
    SelectionSummary: DefaultSelectionSummary
};

export default Dropdown;