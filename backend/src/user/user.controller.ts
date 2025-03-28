import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from 'src/auth/roles.enum';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() currentUser: { id: number, role: number }
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) throw new ForbiddenException();
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() currentUser: { id: number, role: number }
  ) {
    return this.userService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.remove(id);
  }
}
