import { Request, Response } from 'express';
import { BadRequestError, UnprocessableEntityError } from '../helpers/api-errors';
import { imcRepository } from '../repositories/ImcRepository';

export class ImcController {
    async create(req: Request, res: Response) {
        const { weight, height } = req.body;
        const user = req.user;

        if (!weight || !height) {
            throw new UnprocessableEntityError('Altura e peso são obrigatórios');
        }
        if (weight <= 0 || height <= 0) {
            throw new UnprocessableEntityError('Altura e peso devem ser maiores que zero');
        }
        if (height < 100 || height > 300) {
            throw new UnprocessableEntityError('Altura inválida em cm');
        }
        if (weight < 30 || weight > 300) {
            throw new UnprocessableEntityError('Peso inválido em Kg');
        }

        const imc = weight / ((height/100) * (height/100));
        if(imc <= 0) {
            throw new BadRequestError('IMC inválido');
        }

        let level = '';
        if (imc < 18.5) {
            level = 'Magro';
        } else if (imc >= 18.5 && imc <= 24.9) {
            level = 'Normal';
        } else if (imc >= 25 && imc <= 29.9) {
            level = 'Sobrepeso';
        } else if (imc >= 30 && imc <= 34.9) {
            level = 'Obesidade 1';
        } else if (imc >= 35 && imc <= 39.9) {
            level = 'Obesidade 2';
        } else {
            level = 'Obesidade grave';
        }

        const newImc = await imcRepository.create({
            user: user,
            weight: weight,
            height: height,
            imc: imc,
            level: level
        })

        await imcRepository.save(newImc)

        return res.status(201).json({ message: 'IMC criado com sucesso' })
    }

    async getAllImc(req: Request, res: Response) {
        const user = req.user;

        const imcs = await imcRepository.findBy({ user: user });

        if(imcs.length == 0) {
            return res.status(204).json({ message: 'Nenhum IMC encontrado' });
        }

        for (let i = 0; i < imcs.length - 1; i++) {
            for (let j = 0; j < imcs.length - 1 - i; j++) {
                if (imcs[j].id > imcs[j + 1].id) {
                    // Swap the elements
                    let temp = imcs[j];
                    imcs[j] = imcs[j + 1];
                    imcs[j + 1] = temp;
                }
            }
        }

        return res.status(200).json(imcs);
    }

    async getImcById(req: Request, res: Response) {
        const { id } = req.params;
        const user = req.user;

        const imc = await imcRepository.findBy({ id: Number(id), user: user });

        if (!imc) {
            return res.status(204).json({ message: 'IMC não encontrado' });
        }

        return res.status(200).json(imc);
    }

    async deleteImc(req: Request, res: Response) {
        const { id } = req.params;

        const imc = await imcRepository.findOne({ where: { id: Number(id) } });

        if (!imc) {
            return res.status(204).json({ message: 'IMC não encontrado' });
        }

        await imcRepository.delete(imc);

        return res.status(200).json({ message: 'IMC deletado com sucesso' });
    }
}