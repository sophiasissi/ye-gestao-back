import { Request, Response } from 'express';
import { UnprocessableEntityError } from '../helpers/api-errors';
import { bloodPressureRepository } from '../repositories/BloodPressureRepository';

export class BloodPressureController {
    async create(req: Request, res: Response) {
        const { date, systolic, diastolic } = req.body;
        const user = req.user;

        if(!date || !systolic || !diastolic) {
            throw new UnprocessableEntityError('Campos obrigatórios não preenchidos');
        }

        if(date === '' || systolic === '' || diastolic === '') {
            throw new UnprocessableEntityError('Campos obrigatórios não preenchidos');
        }
        const regexDate = /^\d{4}-\d{2}-\d{2}$/;
        if(!regexDate.test(date)){
            throw new UnprocessableEntityError('Data inválida')
        }
        
        if(systolic < 0 || diastolic < 0) {
            throw new UnprocessableEntityError('Valores inválidos');
        }

        const transformDate = new Date(date)

        let level = ''
        if(systolic < 90 && diastolic < 60) {
            level = 'Baixa'
        } else if((systolic >= 90 && systolic < 120) && (diastolic >= 60 && diastolic < 80)) {
            level = 'Ótima'
        } else if((systolic >= 120 && systolic < 130) && (diastolic >= 80 && diastolic < 85)) {
            level = 'Normal'
        } else if((systolic >= 130 && systolic < 140) && (diastolic >= 85 && diastolic < 90)) {
            level = 'Atenção'
        } else {
            level = 'Alta'
        }

        const newBloodPressure = await bloodPressureRepository.create({
            user: user,
            date: transformDate,
            systolic: systolic,
            diastolic: diastolic,
            level: level
        })

        await bloodPressureRepository.save(newBloodPressure)

        return res.status(201).json({ message: "Pressão arterial cadastrada com sucesso"})
    }

    async getAllBloodPressure(req: Request, res: Response) {
        const user = req.user;

        const bloodPressure = await bloodPressureRepository.findBy({ user: user })

        if (bloodPressure.length === 0){
            return res.status(204).json({ message: 'Nenhuma pressão arterial cadastrada'})
        }

        return res.status(200).json(bloodPressure)
    }

    async getBloodPressureById(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user;

        const bloodPressure = await bloodPressureRepository.findBy({ id: Number(id), user: user })

        if(!bloodPressure) {
            return res.status(204).json({ message: 'Pressão arterial não encontrada' })
        }

        return res.status(200).json(bloodPressure)
    }

    async deleteBloodPressure(req: Request, res: Response) {
        const { id } = req.params;

        const bloodPressure = await bloodPressureRepository.findOne({ where: { id: Number(id) } })

        if(!bloodPressure) {
            return res.status(204).json({ message: 'Pressão arterial não encontrada' })
        }

        await bloodPressureRepository.delete(bloodPressure)
        return res.status(200).json({ message: 'Pressão arterial deletada com sucesso'})
    }
}