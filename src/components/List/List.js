import React from "react";
import PropTypes from "prop-types";

const ListItem = (props) => {
    let { itemData = {} } = props;
    let { name } = itemData;

    return (<li className="RCB-list-item">{name}</li>);
};

ListItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

const List = (props) => {
    const {
        className = "",
        items,
        idAttribute,
        ListItem,
        showNoDataMsg,
        noDataComponent,
        ...restProps
    } = props;

    if (!items.length && showNoDataMsg) {
        return noDataComponent;
    }

    return (<ul className={`RCB-list ${className}`}>
        {items.map((itemData, index) => {
            return (
                <ListItem itemData={itemData} index={index} key={itemData[idAttribute]} idAttribute={idAttribute} {...restProps} />
            )
        })}
    </ul>);
}

const DefaultNoDataComponent = () => {
    return (
        <div className="RCB-no-data">No data found</div>
    )
}

List.propTypes = {
    /** Pass any additional classNames to List component */
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.any
    })).isRequired,
    idAttribute: PropTypes.string,
    /** Pass a custom ListItem component */
    ListItem: PropTypes.oneOfType([
        PropTypes.instanceOf(Element),
        PropTypes.func
    ]),
    noDataComponent: PropTypes.any
}

List.defaultProps = {
    className: "",
    items: [],
    idAttribute: "id",
    ListItem,
    noDataComponent: <DefaultNoDataComponent />
}

export default List;