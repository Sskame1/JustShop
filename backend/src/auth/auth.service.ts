import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private JwtService: JwtService,
    ) { }

    async register(CreateUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: CreateUserDto.email }
        });
        if (existingUser) {
            throw new ConflictException('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(CreateUserDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: CreateUserDto.name,
                email: CreateUserDto.email,
                password: hashedPassword, // save hashing password
                role: CreateUserDto.role || UserRole.USER,
            },
        });

        return this.login(user.email, CreateUserDto.password);
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        
        return {
            access_token: this.JwtService.sign(payload),
            user: { id: user.id, email: user.email, role: user.role }
        };
    }
}
