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

const Table = (props) => {
    const {
        className,
        records,
        columnConfigs,
        idAttribute,
        searchBy,
        searchByKey,
        sortByKey,
        sortOrderKey,
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
        omitProps,
        getUrlParams,
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

    let extraParams = utils.omit(restProps, omitParams);
    let requestParams = {
        [pageNoKey]: pageNo,
        [perPageKey]: perPageCount,
        ...(searchQuery && {[searchByKey]: searchQuery}),
        ...(sortBy && {[sortByKey]: sortBy}),
        ...(sortOrder && {[sortOrderKey]: sortOrder}),
        ...extraParams
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
    const paginationComponent = <PaginationComponent pageSizeList={pageSizeList} 
                            onPageConfigChanged={setPageConfig} 
                            pageConfig={{...pageConfig, total: totalRecords}} />

    let finalRecords = paginationType === "SERVER" ? serverRecords :
                        getPageRecords(filteredRecords, pageConfig);

    let wrappedComponent =  (<BaseTable records={finalRecords} columnConfigs={columnConfigs} 
                                    idAttribute={idAttribute} NoDataComponent={NoDataComponent}
                                    sortByConfig={sortByConfig} onSort={onSort}
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
    /** The field to send the sort by parameter to the API in case of server side paginated table */
    sortByKey: PropTypes.string,
    /** The field to send the sort order parameter to the API in case of server side paginated table */
    sortOrderKey: PropTypes.string,
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
    responseFormatter: PropTypes.func,
     /** If paginationType is "SERVER", 
     * a comma separated list of the props to be omitted from being added to the API request */
    omitProps: PropTypes.string,
    /** If paginationType is "SERVER", function that is expected to return the URL Params object */
    getUrlParams: PropTypes.func
}

Table.defaultProps = {
    ...BaseTable.defaultProps,
    searchByKey: "name",
    sortByKey: "sortBy",
    sortOrderKey: "sortOrder",
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
    perPageKey: "count",
    omitProps: "",
    getUrlParams: () => ({})
};

export default Table;