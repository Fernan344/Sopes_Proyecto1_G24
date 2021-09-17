const express = require("express")
const router = express.Router()
const clientController = require("../Controller/client.controller")

router.get("/", clientController.test)
router.get("/getTweets", clientController.getTweets)

module.exports = router