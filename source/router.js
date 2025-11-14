// router module

import { Router } from "express";

import { mainPage, detailPage } from "./controllers/todos.js";

const router = Router();

router.get("/:id", detailPage);
router.get("/", mainPage);

export default router;
