var convert = require('xml-js');

const getResponseObject = (xml)=>{
    let responseObject = convert.xml2js(xml,{compact:true})["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns2:Response"]
    return {
        errorMessage:responseObject["ns2:errorMessage"]["_text"],
        errorCode:parseInt(responseObject["ns2:errorCode"]["_text"]),
        success:Boolean(responseObject["ns2:success"]["_text"]),
        data:responseObject["ns2:data"]["_text"]
    }
}

module.exports = getResponseObject;