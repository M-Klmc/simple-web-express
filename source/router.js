// router module

import { Router, urlencoded } from "express";
import methodOverride from 'method-override';

import { mainPage, detailPage, addPage, add, setDone, remove } from "./controllers/todos.js";

const router = Router();

router.use(urlencoded({ extended: true }));
router.use(methodOverride('_method'));
//--------------------------------
router.get('/add', addPage);
router.post('/add', add);
//--------------------------------
router.get("/:id", detailPage);
router.get("/", mainPage);
//--------------------------------
router.put('/:id', setDone);
router.delete('/:id', remove);


export default router;
