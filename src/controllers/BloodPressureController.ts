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