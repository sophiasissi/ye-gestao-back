import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity('imc')
export class Imc {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => User, user => user.id)
    user: User

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    weight: number

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    height: number

    @Column({ type: 'decimal', precision: 5, scale: 1 })
    imc: number

    @Column({ type: 'text'})
    level: string
}