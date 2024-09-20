import { Router } from "express";
import { createUser, createWords, deleteWords, editWords, getUsers, getWords, login } from "../controllers/controller";
import { verifyToken } from "../middlewares/jwt";

export const router = Router()

// users --->
router.post('/createUser', createUser)

router.post('/login', login)

router.get('/getUsers', verifyToken, getUsers)

// words --->
router.post('/createWords', verifyToken, createWords)

router.get('/getWords', verifyToken, getWords)

router.put('/editWords', verifyToken, editWords)

router.delete('/deleteWords', verifyToken, deleteWords)