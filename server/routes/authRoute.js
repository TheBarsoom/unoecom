

const express= require("express")
const router = express.Router()

router.post("/register",)
router.post("/login",)
router.get("/logout",)
router.get("/all-users",)
router.get("/refresh-token",)
router.get("/:id",)
router.delete("/:id",)
router.put("/:id",)
router.put("/block-user/:id",)
router.put("/unblock-user/:id",)
router.post("/all-user-delete",)


module.exports=router

