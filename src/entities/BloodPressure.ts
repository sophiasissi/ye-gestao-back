import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("blood_pressures")
export class BloodPressure {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'integer' })
    systolic: number;

    @Column({ type: 'integer' })
    diastolic: number;

    @Column({ type: 'text' })
    level: string;
}