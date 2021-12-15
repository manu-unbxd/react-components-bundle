import React, { Fragment, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import utils from "../../core/utils";
import Checkbox from "../Form/Checkbox";

const DEFAULT_CHECKBOX_CONFIG = {
    enabled: false, 
    showInHeader: true
};

const DefaultNoDataComponent = () => {
    return (<div className="RCB-no-data">No data found</div>)
};

/* eslint-disable react/prop-types */

const getTDValue = ({ columnValue, rowData = {}, columnConfig = {}, tdProps = {}}) => {
    const { key, valueFormatter, ColumnComponent, componentProps = {} } = columnConfig;
    let tdValue = columnValue;

    if (typeof(valueFormatter) === "function") {
        tdValue = valueFormatter({value: columnValue, record: rowData});
    } else if (ColumnComponent) {
        tdValue = <ColumnComponent record={rowData} {...componentProps} />
    }

    return <td key={key} {...tdProps}>{tdValue}</td>
}

const ExpandableTR = (props) => {
    const { 
        rowIndex, 
        rowData, 
        columnConfigs, 
        isEven, 
        ExpandedRowComponent, 
        showCheckbox,
        checkboxChangeCounter,
        checkboxValue,
        onSelectionChange
    } = props;
    const [ selected, setSelected ] = useState(checkboxValue || false);
    const [ isExpanded, setIsExpanded ] = useState(false);

    const onChange = (value) => {
        setSelected(value);
        onSelectionChange(rowData, value);
    };

    useEffect(() => {
        setSelected(checkboxValue);
    }, [checkboxChangeCounter, checkboxValue]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const className = "RCB-tr RCB-parent-row " + (isEven ? "RCB-even-tr" : "RCB-odd-tr");

    return (<Fragment>
        <tr className={className}>
            {/* add column for expand toggle icon */}
            {getTDValue({
                columnValue: "",
                columnConfig: {
                    key: "expandIcon"
                },
                tdProps: {
                    onClick: toggleExpanded,
                    className: isExpanded ? "expand-open" : "expand-close"
                }
            })}
            {showCheckbox && <td key={`checkbox-colum-${rowIndex}`}>
                <Checkbox name={`checkbox${rowIndex}`} type="checkbox" className="table-checkbox" onChange={onChange} value={selected} />
            </td>}
            {columnConfigs.map(configObj => {
                const { key } = configObj;
                return getTDValue({
                    columnValue: rowData[key],
                    rowData,
                    columnConfig: configObj,
                    tdProps: {
                        onClick: toggleExpanded
                    }
                });
            })}
        </tr>
        {isExpanded && <tr className="RCB-expanded-row">
            {/* +1 is to accomodate the expand toggle icon column */}
            <td colSpan={columnConfigs.length + 1}>
                <ExpandedRowComponent parentRecord={rowData} />
            </td>
        </tr>}
    </Fragment>);
};

ExpandableTR.propTypes = {
    ExpandedRowComponent: PropTypes.any.isRequired // TODO : check for a React Component
};

const TR = (props) => {
    const { 
        rowIndex, 
        rowData, 
        columnConfigs, 
        isEven, 
        showCheckbox,
        checkboxChangeCounter,
        checkboxValue,
        onSelectionChange } = props;
    const [ selected, setSelected ] = useState(checkboxValue || false);
    const className = "RCB-tr " + (isEven ? "RCB-even-tr" : "RCB-odd-tr");

    const onChange = (value) => {
        setSelected(value);
        onSelectionChange(rowData, value);
    };

    useEffect(() => {
        setSelected(checkboxValue);
    }, [checkboxChangeCounter, checkboxValue]);
    
    return (<tr className={className}>
        {showCheckbox && <td key={`checkbox-colum-${rowIndex}`}>
            <Checkbox name={`checkbox${rowIndex}`} type="checkbox" className="table-checkbox" onChange={onChange} value={selected} />
        </td>}
        {columnConfigs.map(configObj => {
            const { key } = configObj;
            return getTDValue({columnValue: rowData[key], rowData, columnConfig: configObj});
        })}
    </tr>);
};

let BaseTable = (props, ref) => {
    const {
        className,
        records,
        columnConfigs,
        idAttribute,
        checkboxConfig,
        isExpandableTable,
        ExpandedRowComponent,
        noDataComponent,
        sortByConfig
    } = props;
    const { enabled:showCheckbox, showInHeader } = {...DEFAULT_CHECKBOX_CONFIG, ...(checkboxConfig || {})};
    const { sortBy, sortOrder } = sortByConfig;

    const [ checkboxValue, setCheckboxValue ] = useState(false);
    const [ checkboxChangeCounter, setChangeCounter ] = useState(0);
    const [ selected, setSelected ] = useState([]);

    const RowComponent = isExpandableTable ? ExpandableTR : TR;

    const onSelectionChange = (record, checked) => {
        if (checked) {
            /* add to selected array */
            setSelected([...selected, record]);
        } else {
            /* remove from selected array */
            const newSelected = selected.filter(obj => {
                return obj[idAttribute] !== record[idAttribute];
            });

            setSelected(newSelected);
        }
    };

    const getSelectedRows = () => {
        return selected;
    };
    
    const updateCheckboxValue = (newValue) => {
        setCheckboxValue(newValue);
        setChangeCounter(checkboxChangeCounter + 1);
    };

    const resetSelected = () => {
        updateCheckboxValue(false);
        setSelected([]);
    };

    const toggleSelectAll = () => {
        const checked = !checkboxValue;
        updateCheckboxValue(checked);
        
        if (checked) {
            setSelected(records);
        } else {
            setSelected([]);
        }
    };
    
    useImperativeHandle(ref, () => ({
        getSelectedRows,
        resetSelected
    }));

    if (records.length === 0) {
        return noDataComponent;
    } else {
        return (<table className={`RCB-table ${className}`}>
            <thead>
                <tr>
                    {/* add empty column for expand icon */}
                    {isExpandableTable && <th key="expandIcon" className="RCB-th RCB-expand-column"></th>}
                    {showCheckbox && (showInHeader ? <th key="headerCheckbox">
                        <Checkbox name="headerCheckbox" type="checkbox" className="table-checkbox" 
                            value={checkboxValue} onChange={toggleSelectAll} />
                    </th> : <th/>)}
                    {columnConfigs.map(columnObj => {
                        const { key, label, sortable, headerClassName } = columnObj;
                        let className = "RCB-th";
                        let thAttrs = {};

                        if (sortable) {
                            className += " RCB-th-sortable";
                            
                            if (sortBy === key) {
                                className += ` RCB-th-${sortOrder.toLowerCase()}`;
                            } else {
                                className += " RCB-th-sort";
                            }

                            thAttrs = {
                                onClick: () => {
                                    props.onSort(columnObj);
                                }
                            }
                        }

                        if (headerClassName) {
                            className += ` ${headerClassName}`;
                        }

                        return (<th className={className} key={key} {...thAttrs}>{label}</th>);
                    })}
                </tr>
            </thead>
            <tbody>
                {records.map((rowData, index)=> {
                    return <RowComponent key={rowData[idAttribute]} 
                                        isEven={utils.isEven(index)} rowIndex={index}
                                        rowData={rowData} 
                                        columnConfigs={columnConfigs} 
                                        ExpandedRowComponent={ExpandedRowComponent}
                                        showCheckbox={showCheckbox} checkboxValue={checkboxValue} checkboxChangeCounter={checkboxChangeCounter}
                                        onSelectionChange={onSelectionChange} />
                })}
            </tbody>
        </table>)
    }
};

BaseTable = forwardRef(BaseTable);

/* eslint-enable react/prop-types */

BaseTable.propTypes = {
    /** Pass any additional classNames to Table component */
    className: PropTypes.string,
    /** Array containing table row data */
    records: function(props, propName) {
        if (props["paginationType"] == "CLIENT") {
            if (!props[propName]) {
                return new Error("Please provide the table records for paginationType 'CLIENT'!");
            }

            if (Object.prototype.toString.call(props[propName]) !== "[object Array]") {
                return new Error("'records' must be an array");
            }
        }
    },
    /** Array containing the table columns config */
    columnConfigs: PropTypes.array.isRequired,
    /** ID attribute key to use when rendering the dropdown items */
    idAttribute: PropTypes.string,
    /* Config to display checkbox in the first column of the table
     *  { 
         enabled: false, // turn this on to display checkbox in first column of the table
         showInHeader: true // turn this off to not display the checkbox in the table header
        }
     */
    checkboxConfig: PropTypes.object,
    /** set to "true" if table rows are expandable */
    isExpandableTable: PropTypes.bool,
    /** Component to be rendered on expanding a row */
    ExpandedRowComponent: PropTypes.oneOfType([
        PropTypes.instanceOf(Element),
        PropTypes.func
    ]),
    /** Component to be rendered if the table has no data */
    noDataComponent: PropTypes.any
}

BaseTable.defaultProps = {
    className: "",
    records: [],
    idAttribute: "id",
    isExpandableTable: false,
    noDataComponent: <DefaultNoDataComponent />
};

export default BaseTable;