import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BaseTable from "./BaseTable";
import DataLoader from "../DataLoader";
import PaginationComponent from "./PaginationComponent";
import utils from "../../core/utils";

const getPageRecords = (records = [], pageConfig = {}) => {
    const pagIndex = utils.getPagIndex(pageConfig);
    const { start, end } = pagIndex;
    
    return records.slice(start, end);
};

const getFilteredRecords = ({records = [], searchBy, searchByKey}) => {
    if (searchBy) {
        searchBy = searchBy.toLowerCase();

        return records.filter(obj => {
            const val = (obj[searchByKey] ? obj[searchByKey] : "").toLowerCase();
            return (val.indexOf(searchBy) !== -1)
        });
    } else {
        return records;
    }
};

const Table = (props) => {
    const {
        className,
        records,
        columnConfigs,
        idAttribute,
        searchBy,
        searchByKey,
        paginationPosition,
        paginationType,
        requestId,
        pageNoKey,
        perPageKey,
        pageSizeList,
        isExpandableTable,
        ExpandedRowComponent,
        responseFormatter,
        NoDataComponent,
        ...restProps
    } = props;
    const [ serverRecords, setServerRecords ] = useState([]);
    const [ serverTotal, setServerTotal ] = useState(0);
    const [ searchQuery, setSearchQuery ] = useState(searchBy);
    const [ pageConfig, setPageConfig ] = useState({
        perPageCount: pageSizeList[0].id,
        pageNo: 1
    });
    const { perPageCount, pageNo } = pageConfig;

    let extraParams = utils.omit(restProps, [pageNoKey, perPageKey]);
    let requestParams = {
        [pageNoKey]: pageNo,
        [perPageKey]: perPageCount,
        [searchByKey]: searchQuery,
        ...extraParams
    };

    const requests = [{
        requestId: requestId,
        params: requestParams
    }];

    const onDataLoaded = ([response]) => {
        let apiResponse = response;

        if (typeof(responseFormatter) === "function") {
            apiResponse = responseFormatter(response);
        }

        let { entries, total }  = apiResponse; 

        setServerRecords(entries);
        setServerTotal(total);
    };

    useEffect(() => {
        /* Search value changed: reset pageNo. */
        setPageConfig({
            ...pageConfig,
            pageNo: 1
        });
        setSearchQuery(searchBy);
    }, [searchBy]);

    const filteredRecords = getFilteredRecords({records, searchBy, searchByKey});
    const totalRecords = paginationType === "SERVER" ? serverTotal : filteredRecords.length;
    const paginationComponent = <PaginationComponent pageSizeList={pageSizeList} 
                            onPageConfigChanged={setPageConfig} 
                            pageConfig={{...pageConfig, total: totalRecords}} />

    let finalRecords = paginationType === "SERVER" ? serverRecords :
                        getPageRecords(filteredRecords, pageConfig);

    let wrappedComponent =  (<BaseTable records={finalRecords} columnConfigs={columnConfigs} idAttribute={idAttribute} NoDataComponent={NoDataComponent}
                                    isExpandableTable={isExpandableTable} ExpandedRowComponent={ExpandedRowComponent} />);
    
    if (paginationType === "SERVER") {
        wrappedComponent = (<DataLoader requests={requests} onDataLoaded={onDataLoaded}>
            {wrappedComponent}
        </DataLoader>)
    }

    return (<div className={className}>
        {paginationPosition === "TOP" && totalRecords > 0 && paginationComponent}
        {wrappedComponent}
        {paginationPosition === "BOTTOM" && totalRecords > 0 && paginationComponent}
    </div>);
};

Table.propTypes = {
    /** Extends Table properties */
    ...BaseTable.propTypes,
    /** search value to search data in the table */
    searchBy: PropTypes.string,
    /** The field by which to search the data in the table */
    searchByKey: PropTypes.string,
    /** list of supported page sizes  */
    pageSizeList: PropTypes.array,
    /** location where the pagination component must be displayed */
    paginationPosition: PropTypes.oneOf(["TOP", "BOTTOM"]),
    /** CLIENT side pagination or SERVER side pagination */
    paginationType: PropTypes.oneOf(["CLIENT", "SERVER"]),
    /** [SERVER side pagination] the ID of the request to call */
    requestId: PropTypes.string,
    /** [SERVER side pagination] key to send the page number value in, to the API */
    pageNoKey: PropTypes.string,
    /** [SERVER side pagination] key to send the page count value in, to the API */
    perPageKey: PropTypes.string,
     /** If paginationType is "SERVER", 
     * component expects the response to be of the form
     * { [pageNoKey]: <pageNo>, [perPageKey]: <pageSize>, total: <totalCount>, entries: [{}] }
     * If your data is not in this format, use the responseFormatter to format the data to this structure.
     * Input to this function is the response received from your API
     *   */
    responseFormatter: PropTypes.func
}

Table.defaultProps = {
    ...BaseTable.defaultProps,
    searchByKey: "name",
    pageSizeList: [{
        id: "10",
        name: "10"
    }, {
        id: "20",
        name: "20"
    }, {
        id: "50",
        name: "50"
    }, {
        id: "100",
        name: "100"
    }],
    paginationPosition: "TOP",
    paginationType: "CLIENT",
    pageNoKey: "page",
    perPageKey: "count"
};

export default Table;