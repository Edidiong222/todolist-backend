import { Column, OneToMany } from "typeorm";
import { Base } from "./baseEntity";
import { Role } from "src/enum/role.enum";
import { Todolist } from "src/todolist/entities/todolist.entity";
import { todo } from "node:test";

export class User extends Base {
    @Column()
    name!:string;

    @Column({unique:true})
    email!:string;

    @Column()
    password!:string;

    @Column({
        type:"enum",
        enum:Role,
        default:Role.user,
    })
    role!:Role;
    // @OneToMany(()=>Todolist, (todo)=>todo.user)
    todo!: Todolist
}
