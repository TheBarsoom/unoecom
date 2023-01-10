const express = require("express");
const router = express.Router();

router.get("/all-product");
router.get("/:id");
router.post("/");
router.put("/:id");
router.delete("/:id");
router.delete("/all-product-delete/");

module.exports = router;
