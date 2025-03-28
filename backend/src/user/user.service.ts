import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/auth/roles.enum';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: this.userSelectFields(),
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: this.userSelectFields(),
        });
        if (!user) throw new NotFoundException(`User ${id} not found`)
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto, currentUser: { id: number, role: number }) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        if (currentUser.role !== UserRole.ADMIN) {
            if (currentUser.id !== id) throw new ForbiddenException('You can only update your own profile');
            delete updateUserDto.role;
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: this.userSelectFields()
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
            select: this.userSelectFields()
        });
    }

    private userSelectFields() {
        return {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    }
}
