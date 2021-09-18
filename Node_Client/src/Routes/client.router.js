const express = require("express")
const router = express.Router()
const clientController = require("../Controller/client.controller")

router.get("/", clientController.test)
router.get("/getTweets", clientController.getTweets)
router.post("/getReportsMySQL", clientController.reportesMySQL)

module.exports = router