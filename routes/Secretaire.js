var express = require('express');
var router = express.Router();
var secretaireController = require("../controllers/secretaireContrller")
var security = require("../controllers/securityController")
var accessControl = require("../middleware/accessAuthorization")
var policyControl = require("../middleware/policyControl")

router.post('/secretaire/register', secretaireController.register);

router.post('/secretaire/login', security.SecretaireLogin);



module.exports = router;
