import { Request, Response } from 'express';
import { UnprocessableEntityError } from '../helpers/api-errors';
import { consultationRepository } from '../repositories/ConsultationRepository';

export class ConsultationController {
    async create(req: Request, res: Response) {
        const { date, description, returnDate, expertise } = req.body
        const user = req.user

        if (!date || !description || !returnDate || !expertise) {
            throw new UnprocessableEntityError('Campos obrigatórios não preenchidos')
        }
        if(description === '' || expertise === ''){
            throw new UnprocessableEntityError('Campos não podem ser vazios')
        }

        const regexDate = /^\d{4}-\d{2}-\d{2}$/;
        if(!regexDate.test(date)){
            throw new UnprocessableEntityError('Data inválida')
        }

        const regexReturnDate = /^\d{4}-\d{2}-\d{2}$/;
        if(!regexReturnDate.test(returnDate)){
            throw new UnprocessableEntityError('Data de retorno inválida')
        }

        const newConsultation = consultationRepository.create({
            user: user,
            date: new Date(date),
            description: description,
            returnDate: new Date(returnDate),
            expertise: expertise
        })
        await consultationRepository.save(newConsultation)

        res.status(201).json({ message: 'Consulta criada com sucesso' })
    }

    async getAllConsultations(req: Request, res: Response) {
        const user = req.user

        const consultations = await consultationRepository.findBy({ user: user })

        if(consultations.length === 0){
            return res.status(204).json({ message: 'Nenhuma consulta encontrada' })
        }

        for (let i = 0; i < consultations.length - 1; i++) {
            for (let j = 0; j < consultations.length - 1 - i; j++) {
                if (consultations[j].id > consultations[j + 1].id) {
                    // Swap the elements
                    let temp = consultations[j];
                    consultations[j] = consultations[j + 1];
                    consultations[j + 1] = temp;
                }
            }
        }

        res.status(200).json(consultations)
    }

    async getConsultationById(req: Request, res: Response) {
        const user = req.user
        const { id } = req.params

        const consultation = await consultationRepository.findBy( { id: Number(id), user: user })

        if(!consultation){
            return res.status(204).json({ message: 'Consulta não encontrada' })
        }

        res.status(200).json(consultation)
    }

    async deleteConsultation(req: Request, res: Response) {
        const user = req.user
        const { id } = req.params

        const consultation = await consultationRepository.findOne( { where: { id: Number(id), user: user } })

        if(!consultation){
            return res.status(204).json({ message: 'Consulta não encontrada' })
        }

        await consultationRepository.delete(consultation)

        res.status(200).json({ message: 'Consulta deletada com sucesso' })
    }
}