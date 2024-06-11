import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity('consultations')
export class Consultation {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => User, user => user.id)
    user: User

    @Column('text')
    expertise: string

    @Column('date')
    date: Date

    @Column('text')
    description: string

    @Column('date')
    returnDate: Date
}