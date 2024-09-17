import express, { Request, Response } from 'express';
import 'dotenv/config'
import { router } from './routes/router';
import cors from "cors";

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(router)


app.listen(port, () => {
    console.log(`Servidor funcionando: http://localhost:` + port)
})