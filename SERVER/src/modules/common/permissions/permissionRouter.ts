import express from "express";
import { permissionValidator } from "./permissionValidator";
import { validateTenant, validateJWT } from "../../../middleware"
import { hasPermissionController } from "./permissionController";
const router = express.Router();


router.get("/has-permission/:permission", validateJWT, validateTenant, permissionValidator.hasPermission, hasPermissionController);

router.use("/health", (req, res) => {
  res.json("PERMISSION HEALTH OK");
})

export default router;