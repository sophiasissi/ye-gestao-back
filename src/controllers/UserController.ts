import { Request, Response } from 'express';
import { userRepository } from '../repositories/UserRepository';
import { ConflictError, UnauthorizedError, UnprocessableEntityError } from '../helpers/api-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export class UserController {
    async validateToken(req: Request, res: Response) {
        return res.status(200).json({ message: 'ok token' })
    }

    async create(req: Request, res: Response) {
        const { name, email, phone, password } = req.body;

        if(name === '' || email === '' || phone === '' || password === '') {
            throw new UnprocessableEntityError('Preencha todos os campos')
        }
        if(email.indexOf('@') === -1 && email.indexOf('.') === -1) {
            throw new UnprocessableEntityError('Email inválido')
        }
        if(phone.length != 11) {
            throw new UnprocessableEntityError('Telefone inválido')
        }
        if(password.length < 6) {
            throw new UnprocessableEntityError('Senha deve ter no mínimo 6 caracteres')
        }

        const userExists = await userRepository.findOneBy({ email })
        if(userExists) {
            throw new ConflictError('Usuário já cadastrado')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userRepository.create({name, email, phone, password: hashedPassword})
        await userRepository.save(newUser)

        const { id: __, password: _, ...user } = newUser

        return res.status(201).json({ message: 'Usuário criado' })
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if(email === '' || password === '') {
            throw new UnprocessableEntityError('Preencha todos os campos')
        }
        if(email.indexOf('@') === -1 && email.indexOf('.') === -1) {
            throw new UnprocessableEntityError('Email inválido')
        }

        const user = await userRepository.findOneBy({ email })
        if(!user) {
            throw new UnauthorizedError('Email não cadastrado')
        }

        const verifyPass = await bcrypt.compare(password, user.password)
        if(!verifyPass) {
            throw new UnauthorizedError('Senha incorreta')
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', { expiresIn: '1d'})

        return res.status(200).json({ token: token })
    }

    async getUser(req: Request, res: Response) {
        const { id: _, ...user } = req.user
        return res.status(200).json(user)
    }

    async updateUser(req: Request, res: Response) {
        const { name, email, phone } = req.body

        const user = req.user
        const updates: Partial<User> = {};
        if (name !== undefined && name !== user.name) {
            if(name === '') {
                throw new UnprocessableEntityError('Nome inválido')
            }
            updates.name = name;
        }
        if (email !== undefined && email !== user.email) {
            if(email === '' && email.indexOf('@') === -1 && email.indexOf('.') === -1) {
                throw new UnprocessableEntityError('Email inválido')
            }
            updates.email = email;
        }
        if (phone !== undefined && phone !== user.phone) {
            if(phone === '' && phone.length != 11) {
                throw new UnprocessableEntityError('Telefone inválido')
            }
            updates.phone = phone;
        }

        await userRepository.update(user, updates)
        return res.status(200).json({ message: 'Usuário atualizado' })
    }

    async deleteUser(req: Request, res: Response) {
        const user = req.user
        await userRepository.delete(user)
        return res.status(200).json({ message: 'Usuário deletado' })
    }
}