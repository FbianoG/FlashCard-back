import { Router } from "express";
import { createUser, createWords, getWords, login } from "../controllers/controller";
import { create } from "domain";
import { verifyToken } from "../middlewares/jwt";

export const router = Router()

// users --->
router.post('/createUser', createUser)
router.post('/login', login)

router.post('/createWords', verifyToken, createWords)

router.get('/getWords', verifyToken, getWords)