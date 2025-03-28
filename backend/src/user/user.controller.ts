import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async findOne(@Param('id', ParseIntPipe)id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe)id: number,
    @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
    }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseIntPipe)id: number) {
    return this.userService.remove(id);
  }
}
