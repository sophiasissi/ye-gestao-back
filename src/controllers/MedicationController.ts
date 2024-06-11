import { Request, Response } from 'express';
import { UnprocessableEntityError } from '../helpers/api-errors';
import { medicationRepository } from '../repositories/MedicationRepository';

export class MedicationController {
    async create(req: Request, res: Response) {
        const { hour, period, interval, name } = req.body;
        const user = req.user;

        if (!hour || !period || !interval || !name) {
            throw new UnprocessableEntityError('Campos obrigatórios não preenchidos');
        }

        if(hour === '' || period <= 0 || interval <= 0 || name === '') {
            throw new UnprocessableEntityError('Campos não podem ser vazios ou menores que zero');
        }

        const regexHour = /^\d{2}:\d{2}$/;
        if(!regexHour.test(hour)){
            throw new UnprocessableEntityError('Hora inválida');
        }

        const newMedication = medicationRepository.create({
            name: name,
            user: user,
            hour: hour,
            period: period,
            interval: interval
        })

        await medicationRepository.save(newMedication);

        return res.status(201).json({ message: 'Medicação criada com sucesso' });
    }

    async getAllMedication(req: Request, res: Response) {
        const user = req.user;

        const medications = await medicationRepository.find({ where: { user: user }});

        if(medications.length === 0) {
            return res.status(204).json({ message: 'Nenhuma medicação encontrada' });
        }

        for (let i = 0; i < medications.length - 1; i++) {
            for (let j = 0; j < medications.length - 1 - i; j++) {
                if (medications[j].id > medications[j + 1].id) {
                    // Swap the elements
                    let temp = medications[j];
                    medications[j] = medications[j + 1];
                    medications[j + 1] = temp;
                }
            }
        }

        return res.status(200).json(medications);
    }

    async getMedicationById(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user;

        const medication = await medicationRepository.findOne({ where: { id: Number(id), user: user} });

        if(!medication) {
            return res.status(204).json({ message: 'Medicação não encontrada' });
        }

        return res.status(200).json(medication);
    }

    async deleteMedication(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user;

        const medication = await medicationRepository.findOne({ where: { id: Number(id), user: user} });

        if(!medication) {
            return res.status(204).json({ message: 'Medicação não encontrada' });
        }

        await medicationRepository.delete(medication);

        return res.status(200).json({ message: 'Medicação deletada com sucesso' });
    }
}