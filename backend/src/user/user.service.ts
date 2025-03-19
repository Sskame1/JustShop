import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = this.prisma.user.findUnique({
            where: { id },
        });
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async remove(id: number) {
        const user = this.prisma.user.findUnique({
            where: { id },
        });
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
