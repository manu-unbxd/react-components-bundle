import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BaseTable from "./BaseTable";
import DataLoader from "../DataLoader";
import PaginationComponent from "./PaginationComponent";
import utils from "../../core/utils";
import { forwardRef } from "react";

const getPageRecords = (records = [], pageConfig = {}) => {
    const pagIndex = utils.getPagIndex(pageConfig);
    const { start, end } = pagIndex;
    
    return records.slice(start, end);
};

const sortNumbersASC = (a, b) => a - b;
const sortNumbersDSC = (a, b) => b - a;
const sortAlphaASC = (a, b) => a < b ? -1 : 1;
const sortAlphaDSC = (a, b) => b < a ? -1 : 1;

const getFilteredRecords = ({records = [], searchBy, searchByKey, sortByConfig}) => {
    let filteredRecords = records;

    if (searchBy) {
        searchBy = searchBy.toLowerCase();

        filteredRecords = records.filter(obj => {
            const val = (obj[searchByKey] ? obj[searchByKey] : "").toLowerCase();
            return (val.indexOf(searchBy) !== -1)
        });
    }

    if (typeof(sortByConfig) === "object" && !utils.isObjectEmpty(sortByConfig)) {
        const { sortBy, sortOrder, columnConfig } = sortByConfig;
        const { valueFormatter } = columnConfig;
        
        filteredRecords = records.slice().sort((obj1, obj2) =>{
            let rowValue1 = obj1[sortBy];
            let rowValue2 = obj2[sortBy];

            const sortValue1 = typeof(valueFormatter) === "function" ? 
                                    valueFormatter({value: rowValue1, record: obj1}) : rowValue1;
            const sortValue2 = typeof(valueFormatter) === "function" ? 
                                    valueFormatter({value: rowValue2, record: obj2}) : rowValue2;

            if (typeof(sortValue) === "number") {
                return sortOrder === "ASC" ? sortNumbersASC(sortValue1, sortValue2) : sortNumbersDSC(sortValue1, sortValue2);
            } else {
                return sortOrder === "ASC" ? sortAlphaASC(sortValue1, sortValue2) : sortAlphaDSC(sortValue1, sortValue2); 
            }
        });
    }

    return filteredRecords;
};

export const REQUEST_KEYS = {
    searchBy: "search",
    sortBy: "sortBy",
    sortOrder: "sortOrder",
    sortASC: "ASC",
    sortDSC: "DSC"
};

let Table = (props, ref) => {
    const {
        className,
        records,
        columnConfigs,
        idAttribute,
        searchBy,
        getRequestKeys,
        showPaginateBar,
        paginationPosition,
        paginationType,
        paginationBar,
        requestId,
        pageNoKey,
        perPageKey,
        pageSizeList,
        isExpandableTable,
        ExpandedRowComponent,
        responseFormatter,
        noDataComponent,
        omitProps,
        getUrlParams,
        getRequestParams,
        checkboxConfig,
        ...restProps
    } = props;
    /* variables for server data */
    const [ serverRecords, setServerRecords ] = useState([]);
    const [ serverTotal, setServerTotal ] = useState(0);

    /* variables for search, sort data */
    const [ searchQuery, setSearchQuery ] = useState(searchBy);
    const [ sortByConfig, setSortByConfig ] = useState({});
    const { sortBy, sortOrder } = sortByConfig;

    /* variables for pagination data */
    const [ pageConfig, setPageConfig ] = useState({
        perPageCount: pageSizeList[0].id,
        pageNo: 1
    });
    const { perPageCount, pageNo } = pageConfig;
    const omitParams = [pageNoKey, perPageKey, ...omitProps.split(",")]

    let {  
        searchBy:searchByKey,
        sortBy:sortByKey,
        sortOrder:sortOrderKey,
        sortASC:ASCEnum,
        sortDSC:DSCEnum
    } = {...REQUEST_KEYS, ...getRequestKeys()};

    let extraParams = utils.omit(restProps, omitParams);
    let requestParams = {
        ...getRequestParams(),
        ...extraParams,
        [pageNoKey]: pageNo,
        [perPageKey]: perPageCount,
        ...(searchQuery && {[searchByKey]: searchQuery}),
        ...(sortBy && {[sortByKey]: sortBy}),
        ...(sortOrder && {[sortOrderKey]: sortOrder === "DSC" ? DSCEnum : ASCEnum})
    };

    const requests = [{
        requestId: requestId,
        params: requestParams,
        urlParams: getUrlParams()
    }];

    const onDataLoaded = ([response]) => {
        let apiResponse = response;

        if (typeof(responseFormatter) === "function") {
            apiResponse = responseFormatter(response);
        }

        let { entries, total }  = apiResponse; 

        if (pageNo > 1 && entries.length === 0) {
            /* current page does not have records, so fetch previous page */
            setPageConfig({
                ...pageConfig,
                pageNo: pageNo - 1
            });
        }

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

    const onSort = (columnConfig) => {
        const newSortBy = columnConfig.key;
        let newSortOrder = "ASC";

        if (sortBy === newSortBy) {
            /* clicked sort on the same column */
            newSortOrder = sortOrder === "ASC" ? "DSC" : "ASC";
        }

        setSortByConfig({
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            columnConfig
        });
    };

    const filteredRecords = getFilteredRecords({records, searchBy, searchByKey, sortByConfig});
    const totalRecords = paginationType === "SERVER" ? serverTotal : filteredRecords.length;
    const paginationProps = {
        pageSizeList: pageSizeList,
        onPageConfigChanged: setPageConfig,
        pageConfig: {...pageConfig, total: totalRecords}
    };

    const paginationComponent = (<div className="RCB-paginate-bar">
                                    {paginationBar ? React.cloneElement(paginationBar, paginationProps) 
                                    : <PaginationComponent  {...paginationProps}/>}
                                </div>);

    let finalRecords = paginationType === "SERVER" ? serverRecords :
                        (showPaginateBar ? getPageRecords(filteredRecords, pageConfig) : filteredRecords);

    let wrappedComponent =  (<BaseTable ref={ref} records={finalRecords} columnConfigs={columnConfigs} checkboxConfig={checkboxConfig}
                                    idAttribute={idAttribute} noDataComponent={noDataComponent}
                                    sortByConfig={sortByConfig} onSort={onSort}
                                    isExpandableTable={isExpandableTable} ExpandedRowComponent={ExpandedRowComponent} />);
    
    if (paginationType === "SERVER") {
        wrappedComponent = (<DataLoader requests={requests} onDataLoaded={onDataLoaded}>
            {wrappedComponent}
        </DataLoader>)
    }

    return (<div className={className}>
        {showPaginateBar && paginationPosition === "TOP" && totalRecords > 0 && paginationComponent}
        {wrappedComponent}
        {showPaginateBar && paginationPosition === "BOTTOM" && totalRecords > 0 && paginationComponent}
    </div>);
};

Table = forwardRef(Table);

Table.propTypes = {
    /** Extends Table properties */
    ...BaseTable.propTypes,
    /** search value to search data in the table */
    searchBy: PropTypes.string,
    /** list of supported page sizes  */
    pageSizeList: PropTypes.array,
    /** set to false to disable pagination bar */
    showPaginateBar: PropTypes.bool,
    /** location where the pagination component must be displayed */
    paginationPosition: PropTypes.oneOf(["TOP", "BOTTOM"]),
    /** CLIENT side pagination or SERVER side pagination */
    paginationType: PropTypes.oneOf(["CLIENT", "SERVER"]),
    /** You can provide a custom component for the pagination bar 
     * if you want to add more content to the pagination bar other than the pagination widget.
     * Make sure to include <PagniationComponent /> and pass on all the props sent to this custom component
      */
    paginationBar: PropTypes.any,
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
    responseFormatter: PropTypes.func,
     /** If paginationType is "SERVER", 
     * a comma separated list of the props to be omitted from being added to the API request */
    omitProps: PropTypes.string,
    /** If paginationType is "SERVER", function that is expected to return the key configs for the various request settings
     * in the format { searchBy, sortBy, sortOrder }
     */
    getRequestKeys: PropTypes.func,
    /** If paginationType is "SERVER", function that is expected to return the URL Params object */
    getUrlParams: PropTypes.func,
    /** If paginationType is "SERVER", function that is expected to return the Request Params object */
    getRequestParams: PropTypes.func
}

Table.defaultProps = {
    ...BaseTable.defaultProps,
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
    showPaginateBar: true,
    paginationPosition: "TOP",
    paginationType: "CLIENT",
    pageNoKey: "page",
    perPageKey: "count",
    omitProps: "",
    getRequestKeys: () => ({}),
    getUrlParams: () => ({}),
    getRequestParams: () => ({})
};

export default Table;