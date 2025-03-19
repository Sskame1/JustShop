import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { PrismaService } from '../prisma/prisma.service';

  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor (
        private reflector: Reflector,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if(!roles){
            return true; 
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throw new ForbiddenException('Access denied')
        }

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub }
            });

            if (!user || !roles.includes(user.role)) {
                throw new ForbiddenException('Access denied');
            }

            return true;
        } catch {
            throw new ForbiddenException('Access denied');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
  }