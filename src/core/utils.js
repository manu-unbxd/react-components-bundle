let uniqueCounter = 1;

const utils = {
    configs: {},
    setDefaultConfigs: function(configs) {
        this.configs = {...this.configs, ...configs};
    },
    getDefaultConfigs: function() {
        return this.configs;
    },
    getDefaultConfig: function(key) {
        return this.configs ? this.configs[key] : "";
    },
    getQueryParams: function(params = {}) {
        let queryParams = [];
        
        queryParams = Object.keys(params).map(key => {
            return `${key}=${params[key]}`;
        });

        return queryParams.join("&");
    },
    isEven: function(value) {
        return value % 2 === 0;
    },
    getPagIndex: function(pageConfig) {
        const { perPageCount, pageNo } = pageConfig;
        const startIndex = (pageNo - 1) * perPageCount;
        const endIndex = pageNo * perPageCount;

        return {
            start: startIndex,
            end: endIndex
        };
    },
    omit: function(object = {}, omitKeys = []) {
        let newObject = {};

        for (let key in object) {
            if (omitKeys.indexOf(key) === -1) {
                newObject[key] = object[key];
            }
        }

        return newObject;
    },
    getUniqueId: function() {
        return uniqueCounter++;
    },
    isObjectEmpty: function(obj) {
        return Object.keys(obj).length ? false : true;
    },
    debounce: function(func, debounceTime) {
        let timeout;

        return function() {
            const context = this, 
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                func.apply(context, args);
            }, debounceTime);
        };
    }
}

export default utils;