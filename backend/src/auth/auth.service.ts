import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private JwtService: JwtService,
    ) {}

    async register(CreateUserDto: CreateUserDto) {
        const { name, email, password, role } = CreateUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, // save hashing password
                role: role || 'USER',
            },
        });

        const { password: _, ...result } = user
        return result;
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new  UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.JwtService.sign(payload),
        };
    }
}
