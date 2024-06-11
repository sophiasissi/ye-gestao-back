import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import { AppDataSource } from './data-source'
import routes from './routes'
import { errorMiddleware } from './middlewares/error'

AppDataSource.initialize().then(() => {
    const app = express()

    app.use(express.json())
    
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))

    app.use(routes)
    
    app.use(errorMiddleware)
    
    return app.listen(process.env.PORT)
})
