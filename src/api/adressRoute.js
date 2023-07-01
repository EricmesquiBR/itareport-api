const adressController = require("../controllers/adressController");

const express = require("express");
const router = express.Router();

//router.post("/adress/:id", adressController.createadress);
router.get("/adresses", adressController.findAllAdresses);
//router.get("/adress/:id", adressController.findadressById);
//router.put("/adress/:id", adressController.Updateadress);
//router.delete("/adress/:id", adressController.deleteadress);

module.exports = router;