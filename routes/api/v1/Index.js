const express = require('express');
const router = express.Router();
const UserRouter = require("./User");
/**
 * APIs routes.
 */
router.use('/user', UserRouter);

module.exports = router;
