var express = require('express');
var router = express.Router();
var soap = require('soap');
var convert = require('xml-js');
var getResponseObject = require("../services/parseResponse")
const {check, validationResult } = require('express-validator');

const url = "http://localhost:8080/ws/wallet.wsdl";

const validateRechargeWallet = [
    check("document").not().isEmpty(),
    check("amount").isFloat({min:0.01}),
    check("cellphone").not().isEmpty()
];

const validatePayOrder = [
    check("emailFromPay").isEmail(),
    check("emailToPay").isEmail(),
    check("amount").isFloat({min:0.01}),
]

const validatePayConfirm = [
    check("token").not().isEmpty(),
    check("sessionId").not().isEmpty()
]

const validGetBalance = [
    check("document").not().isEmpty(),
    check("cellphone").not().isEmpty()
]

router.post('/recharge',validateRechargeWallet,function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ 
            errorMessage:`El campo ${errors.array()[0].param} no es válido`,
            errorCode:400,
            success:false
        });
    }else{
        soap.createClientAsync(url).then((client) => {
            return client.rechargeWalletAsync(req.body);
        }).then((response) => {
            res.json(getResponseObject(response[1]));
        });
    }
});

router.post('/pay/order',validatePayOrder,function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ 
            errorMessage:`El campo ${errors.array()[0].param} no es válido`,
            errorCode:400,
            success:false
        });
    }else{
        soap.createClientAsync(url).then((client) => {
            return client.generatePayOrderAsync(req.body);
        }).then((response) => {
            res.json(getResponseObject(response[1]));
        });
    }
});

router.post('/pay/confirm/:token',validatePayConfirm,function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ 
            errorMessage:`El campo ${errors.array()[0].param} no es válido`,
            errorCode:400,
            success:false
        });
    }else{
        soap.createClientAsync(url).then((client) => {
            req.body.token = req.params.token;
            return client.confirmPayOrderAsync(req.body);
        }).then((response) => {
            res.json(getResponseObject(response[1]));
        });
    }
});

router.post('/balance',validGetBalance,function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ 
            errorMessage:`El campo ${errors.array()[0].param} no es válido`,
            errorCode:400,
            success:false
        });
    }else{
        soap.createClientAsync(url).then((client) => {
            req.body.token = req.params.token;
            return client.getBalanceAsync(req.body);
        }).then((response) => {
            res.json(getResponseObject(response[1]));
        });
    }
});




module.exports = router;
