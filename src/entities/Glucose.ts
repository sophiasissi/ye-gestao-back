import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity('glucoses')
export class Glucose {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => User, user => user.id)
    user: User

    @Column({ type: 'date'})
    date: Date

    @Column({ type: 'integer'})
    value: number

    @Column({ type: 'text'})
    level: string
}