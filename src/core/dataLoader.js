import { Promise } from "bluebird";
import { fetch as fetchPolyfill } from "whatwg-fetch";
import utils from "./utils";

class DataLoader {
    _requestsMap = {}
    _commonHeaders = {}
    _responseParser = x => x
    _requestParser = x => x
    _middlewares = {}
    setCommonHeaders (headers) {
        this._commonHeaders = {...this._commonHeaders, ...headers};
    }
    setResponseParser (responseParser) {
        this._responseParser = responseParser;
    }
    setRequestParser (requestParser) {
        this._responseParser = requestParser;
    }
    addRequestConfig (requestId, requestConfig) {
        this._requestsMap[requestId] = requestConfig;
    }
    getRequestMiddleware (requestId) {
        let requestMiddleware = (x, y) => y, 
            middleware = this._middlewares[requestId];

        if (typeof(middleware) !== "undefined" && typeof(middleware.reqParser) === "function") {
            requestMiddleware = middleware.reqParser;
        }

        return requestMiddleware;
    }
    getResponseMiddleware (requestId) {
        let responseMiddleware = (x, y) => y, 
            middleware = this._middlewares[requestId];

        if (typeof(middleware) !== "undefined" && typeof(middleware.resParser) === "function") {
            responseMiddleware = middleware.resParser;
        }

        return responseMiddleware;
    }
    getRequestParams (requestId, params) {
        const requestParser = this.getRequestMiddleware(requestId);
        return requestParser(params, requestId);
    }
    parseResponseData (requestId, response) {
        const responseParser = this.getResponseMiddleware(requestId);
        const commonParser = this._responseParser;
        /* parse through common parser */
        response = typeof(commonParser) === "function" ? commonParser(response, requestId) : response;
        return responseParser(response, requestId);
    }
    getRequestDef ({ requestId, urlParams = {}, params = {}, headers = {} }) {
        const requestConfig = this._requestsMap[requestId];
        const { url, method = "GET" } = requestConfig;
        const finalRequestParams = this.getRequestParams(requestId, params);
        
        let requestUrl = (typeof(url) === "function") ? url(urlParams) : url;
        let reqMethod = method.toLowerCase();

        let requestMetadata = {
            method: (reqMethod === "form_post" || reqMethod === "upload") ? "post" : method,
            headers: {...this._commonHeaders, ...headers}
        };


        if (reqMethod === "get") {
            requestUrl = `${requestUrl}?${utils.getQueryParams(finalRequestParams)}`;
        } else  if (["post", "delete", "put", "patch"].indexOf(reqMethod) > -1) {
            requestMetadata.body = JSON.stringify(finalRequestParams);
        } else if (reqMethod === "form_post" || reqMethod === "upload") {
            const formData = new FormData();
            for (const key in finalRequestParams) {
                formData.append(key, finalRequestParams[key]);
            }
            requestMetadata.body = formData;
        }

        return new Promise((resolve, reject) => {
            return fetchPolyfill(requestUrl, requestMetadata)
                .then(response => {
                    const stringStatus = response.status.toString();
                    if (stringStatus.indexOf("2") === 0 || stringStatus.indexOf("4") === 0) {
                        /* Success : 2** response code, or 4** response code */
                        return response.json();
                    } else {
                        reject(response.statusText);
                    }
                })
                .then(json => {
                    const parsedResponse = this.parseResponseData(requestId, json);
                    resolve(parsedResponse);
                })
                .catch(exception => {
                    reject(exception);
                });
        });
    }
    addMiddleware (requestId, { requestParser, responseParser }) {
        if (typeof(this._middlewares[requestId]) !== "undefined") {
            throw new Error(`Middleware for ${requestId} already exists`);
        }

        this._middlewares[requestId] = {
            reqParser: requestParser,
            resParser: responseParser
        };
    }
}

export default new DataLoader();