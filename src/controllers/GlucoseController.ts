import { Request, Response } from 'express';
import { UnprocessableEntityError } from '../helpers/api-errors';
import { glucoseRepository } from '../repositories/GlucoseRepository';

export class GlucoseController {
    async create(req: Request, res: Response) {
        const { date, value } = req.body
        const user = req.user

        if(date === undefined || date === '') {
            throw new UnprocessableEntityError('Data inválida')
        }
        if(value === undefined || value === '' || value < 0) {
            throw new UnprocessableEntityError('Valor inválido')
        }

        const regexDate = /^\d{4}-\d{2}-\d{2}$/;
        if(!regexDate.test(date)){
            throw new UnprocessableEntityError('Data inválida')
        }

        const transformDate = new Date(date)

        let level = ''
        if(value < 70) {
            level = 'baixa'
        } else if(value >= 70 && value <= 99) {
            level = 'Normal'
        } else if(value >= 100 && value <= 125) {
            level = 'Atenção'
        } else {
            level = 'Alta'
        }

        const newGlucose = await glucoseRepository.create({
            user: user,
            date: transformDate,
            value: value,
            level: level
        })
        await glucoseRepository.save(newGlucose)

        return res.status(201).json({ message: 'Glicose criada' })
    }

    async getAllGlucose(req: Request, res: Response) {
        const user = req.user
        const glucoses = await glucoseRepository.findBy({ user: user})

        if(glucoses.length === 0) {
            return res.status(204).json({ message: 'Nenhuma glicose cadastrada'})
        }
        return res.status(200).json(glucoses)
    }

    async getGlucoseById(req: Request, res: Response) {
        const { id } = req.params
        const user = req.user
        const glucose = await glucoseRepository.findBy({ id: Number(id), user: user })
        if(!glucose) {
            return res.status(204).json({ message: 'Glicose não encontrada'})
        }
        return res.status(200).json(glucose)
    }

    async deleteGlucose(req: Request, res: Response) {
        const { id } = req.params
        
        const glucose = await glucoseRepository.findOne({ where: { id: Number(id) } })
        if(!glucose) {
            throw new UnprocessableEntityError('Glicose não existe')
        }

        await glucoseRepository.delete(glucose)

        return res.status(200).json({ message: 'Glicose deletada' })
    }
}