import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(CreateUserDto: CreateUserDto) {
        const { name, email, password } = CreateUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, // save hashing password
            },
        });

        const { password: _, ...result } = user
        return result;
    }
}
