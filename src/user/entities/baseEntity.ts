import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Base{
    @PrimaryGeneratedColumn()
    id!:string;
    @CreateDateColumn()
    createdDate!:Date;
}