/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-08 13:25:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 13:39:37
 * @Description: 
 */

declare var $;
declare var Steedos;

export const authRequest = (url, options)=>{
    var result = null;
    url = Steedos.absoluteUrl(url);
    try {
        var authorization = Steedos.getAuthorization();
        var headers = [{
            name: 'Content-Type',
            value: 'application/json'
        }, {
            name: 'Authorization',
            value: authorization
        }];

        var defOptions = {
            type: "get",
            url: url,
            dataType: "json",
            contentType: 'application/json',
            beforeSend: function (XHR) {
                if (headers && headers.length) {
                    return headers.forEach(function (header) {
                        return XHR.setRequestHeader(header.name, header.value);
                    });
                }
            },
            success: function (data) {
                result = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                    const errorInfo = XMLHttpRequest.responseJSON.error;
                    result = { error: errorInfo }
                    let errorMsg;
                    if (errorInfo.reason) {
                        errorMsg = errorInfo.reason;
                    }
                    else if (errorInfo.message) {
                        errorMsg = errorInfo.message;
                    }
                    else {
                        errorMsg = errorInfo;
                    }
                    console.error(errorMsg)
                }
                else {
                    console.error(XMLHttpRequest.responseJSON)
                }
            }
        }
        $.ajax(Object.assign({}, defOptions, options));
        return result;
    } catch (err) {
        console.error(err);
    }
}