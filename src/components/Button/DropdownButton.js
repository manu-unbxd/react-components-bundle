import React, { useRef } from "react";
import PropTypes from "prop-types";
import InlineModal, { InlineModalActivator, InlineModalBody } from "../InlineModal";
import List from "../List";

const DefaultDropdownButtonItem = (props) => {
    let { itemData = {}, onClick } = props;
    let { name } = itemData;

    const onItemClicked = () => {
        onClick(itemData);
    };

    return (<li className="RCB-list-item" onClick={onItemClicked}>{name}</li>);
};

DefaultDropdownButtonItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};
  
const DropdownButton = (props) => {
    const { label, options, className, onClick, DropdownButtonItem } = props;
    const modalRef = useRef();

    const onItemClicked = (itemData) => {
        onClick(itemData);
        modalRef.current.hideModal();
    };

    return (<InlineModal className={`RCB-dropdown-button ${className}`} ref={modalRef}>
        <InlineModalActivator>{label}</InlineModalActivator>
        <InlineModalBody>
            <List items={options} ListItem={DropdownButtonItem} onClick={onItemClicked} />
        </InlineModalBody>
    </InlineModal>);
};

DropdownButton.propTypes = {
    label: PropTypes.string,
    /** Dropdown items list */
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
    })).isRequired,
    onClick: PropTypes.func.isRequired,
    DropdownButtonItem: PropTypes.any,
    className: PropTypes.string
};

DropdownButton.defaultProps = {
    label: "Select",
    DropdownButtonItem: DefaultDropdownButtonItem,
    className: ""
};

export default DropdownButton;