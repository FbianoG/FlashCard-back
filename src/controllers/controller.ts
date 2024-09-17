import { Request, Response } from "express";
import pool from "../dataBase/db";
import { comparePassword, hashPassword } from "../middlewares/bcrypt";
import { createToken } from "../middlewares/jwt";
import { IUser } from "../interfaces/interface";

interface CustomRequest extends Request {
    userId?: number
}


export const createUser = async (req: Request, res: Response) => { // Criar usuário
    try {
        let { name, login, password } = req.body

        console.log('foi')

        // verifica se todos os campos foram preenchidos
        if (!name || !login || !password) {
            return res.status(400).json({ message: 'Preencha todos os campos!' })
        }

        name = name.toLowerCase().trim()
        login = login.toLowerCase().trim()

        // verifica se o login existe
        const searchQuery = 'SELECT * FROM users WHERE login = $1;'
        const searchValues = login
        const searchResult = await pool.query(searchQuery, [searchValues])

        if (searchResult.rows.length > 0) {
            return res.status(400).json({ message: 'Este login já está sendo usado.' })
        }

        // cria hash para a senha
        password = await hashPassword(password)

        // cria o novo usuário
        const query = `INSERT INTO users (name, login, password) VALUES ($1, $2, $3) RETURNING *;`
        const values = [name, login, password]
        const result = await pool.query(query, values)

        return res.status(201).json({ message: 'Usuário criado com sucesso!' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno do servidor!' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        let { login, password } = req.body



        // verifica se todos os campos foram preenchidos --->
        if (!login || !password) {
            return res.status(400).json({ message: 'Preencha todos os campos!' })
        }

        login = login.toLowerCase().trim()

        // verifica se o login existe
        const searchQuery = 'SELECT * FROM users WHERE login = $1;'
        const searchValues = login
        const searchResult = await pool.query(searchQuery, [searchValues])

        if (searchResult.rows.length === 0) {
            return res.status(400).json({ message: 'Login ou senha inválidos!' })
        }

        // verifica se a senha esta correta
        const user: IUser = searchResult.rows[0]
        const match = await comparePassword(password, user.password)

        if (!match) {
            return res.status(400).json({ message: 'Login ou senha inválidos!' })
        }

        const token = await createToken(user.id)

        res.header('Access-Control-Expose-Headers', 'auth-token');
        res.header('auth-token', token)

        return res.status(200).json({ message: 'Login efetuado com sucesso!' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno do servidor!' })
    }
}

export const createWords = async (req: CustomRequest, res: Response) => {
    try {
        let { native, translate } = req.body
        const userId = req.userId

        if (!native || !translate || !userId) {
            return res.status(400).json({ message: 'Preencha todos os campos!' })
        }

        native = native.toLowerCase().trim()
        translate = translate.toLowerCase().trim()

        // verifica se a palavra existe
        const searchQuery = 'SELECT * FROM words WHERE native = $1 AND user_id = $2;'
        const searchValues = [native, userId]
        const searchResult = await pool.query(searchQuery, searchValues)
        if (searchResult.rows.length > 0) {
            return res.status(400).json({ message: 'Esta palavra já está cadastrada.' })
        }

        // cria a palavra
        const query = `INSERT INTO words (native, translate, user_id) VALUES ($1, $2, $3);`
        const values = [native, translate, userId]
        const result = await pool.query(query, values)

        return res.status(200).json({ message: 'Palavra criada com sucesso!' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno do servidor!' })
    }
}

export const getWords = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId

        if (!userId) {
            return res.status(400).json({ message: 'Usuário não encontrado.' })
        }

        const query = `SELECT * FROM words WHERE user_id = $1;`
        const values = [userId]
        const result = await pool.query(query, values)

        return res.status(200).json(result.rows)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno do servidor!' })
    }
}