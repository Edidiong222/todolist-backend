import { CanActivate, Injectable,ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector:Reflector, private userService:UserService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const roles = this.reflector.get<String[]>('roles',context.getHandler())
        const request = context.switchToHttp().getRequest();

         if (request?.user){
        const headers: Headers = request.headers;
        const user = this.userService.user(headers);

        if(!roles.includes((await user).role)){
            throw new ForbiddenException(roles.join(' or '))
        }
        return true;
    }
    return false;
    }
   
} 