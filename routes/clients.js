var express = require('express');
var router = express.Router();
var soap = require('soap');
var convert = require('xml-js');
var getResponseObject = require("../services/parseResponse")
const {check, validationResult } = require('express-validator');

const url = "http://localhost:8080/ws/countries.wsdl";

const validateClient = [
    check("document").not().isEmpty(),
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("email").isEmail(),
    check("cellphone").not().isEmpty()
];

router.post('/',validateClient,function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ 
            errorMessage:`El campo ${errors.array()[0].param} no es válido`,
            errorCode:400,
            success:false
        });
    }else{
        soap.createClientAsync(url).then((client) => {
            return client.createClientAsync(req.body);
        }).then((response) => {
            res.json(getResponseObject(response[1]));
        });
    }
});

module.exports = router;
