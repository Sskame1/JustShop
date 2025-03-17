import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(CreateUserDto: CreateUserDto) {
        const { name, email, password } = CreateUserDto;
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password, //no hashing
            },
        });
        return user;
    }
}
