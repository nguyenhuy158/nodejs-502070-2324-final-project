const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report-controller");

router
    .get("/", reportController.getReportPage)
    .get("/statistical", reportController.extractQueryParams, reportController.getStatisticalPage)
    .get("/profit", reportController.extractQueryParams, reportController.getProfitPage)
    .get("/customer", reportController.extractQueryParams, reportController.getCustomerStatist)
    .get("/seller", reportController.extractQueryParams, reportController.getSellerStatist)

module.exports = router;