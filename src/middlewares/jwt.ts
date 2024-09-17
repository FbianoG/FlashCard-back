import 'dotenv/config'
import { Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

export const createToken = async (e: number) => { // cria o token
    const token = await jwt.sign({ id: e }, secretKey, { expiresIn: "1h" }) //{id: "valor a ser criptografado"}, chave secreta, { expiresIn: 1h, 10m 30s}
    return token
}

export const verifyToken = async (req: any, res: Response, next: NextFunction) => {

    try {

        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ auth: false, message: 'É necessário fazer login para acessar esta página.' })
        }

        const decoded = jwt.verify(token, secretKey) 

        req.userId = decoded.id

        next()
    } catch (error) {
        return res.status(401).json({ auth: false, message: 'Sessão expirada. Faça login novamente.' })
    }
}