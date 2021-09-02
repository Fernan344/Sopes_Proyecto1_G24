const express = require("express")
const router = express.Router()
const clientController = require("../Controller/client.controller")

router.get("/", clientController.test)
router.post("/addTweet", clientController.addTweet)

module.exports = router