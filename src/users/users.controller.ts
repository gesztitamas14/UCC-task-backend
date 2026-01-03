import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

export class UserDto {
    id: string;
    email: string;
    role: string;
}


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('user/:id')
    async getUserById(@Param('id') id: string): Promise<UserDto> {
        const user = await this.usersService.findById(+id);
        return {
            id: id,
            email: user.email,
            role: user.role,
        };
    }
}
