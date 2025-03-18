import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe)id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe)id: number,
    @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(id, updateUserDto);
    }
}
