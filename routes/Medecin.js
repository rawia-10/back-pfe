var express = require('express');
var router = express.Router();
var medecinController = require("../controllers/MedecinController")
var security = require("../controllers/securityController")
var accessControl = require("../middleware/accessAuthorization")
var policyControl = require("../middleware/policyControl")
const upload = require('../tools/upload');
// const uploadController = require('../controllers/uploadController');

router.post('/medecin/register', medecinController.register);
router.post('/medecin/addrq', medecinController.addrq);
router.delete('/medecin/delete/:id', medecinController.delete);
router.get('/medecin/list', medecinController.list)
router.post('/medecin/login', security.medecinLogin)
router.get('/medecin/rdv/list', medecinController.getAllRdv)
router.get('/medecin/:id', medecinController.getMedecin)
router.post("/medecin/upload", upload.single('file'),medecinController.uploadfile);
router.get("/medecin/auth/profile",  medecinController.profile);
router.put('/medecin/modify', medecinController.update)
router.get('/medecin/getfile/:file',medecinController.getfile)




module.exports = router;