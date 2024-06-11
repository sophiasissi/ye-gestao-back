import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity('medications')
export class Medication {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column({ type: 'text', default: 'semNome'})
    name: string;

    @Column({ type: 'text' })
    hour: string;

    @Column({ type: 'integer' })
    period: number;

    @Column({ type: 'integer' })
    interval: number;
}