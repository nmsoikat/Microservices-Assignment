import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { PRODUCT_PATTERNS, PRODUCT_SERVICE_RMQ } from './common/constants';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
    constructor(
        @Inject(PRODUCT_SERVICE_RMQ) private productClient: ClientProxy
    ) { }

    @Post()
    create(@Req() req: any, @Body() dto: any) {
        const data = {
            userId: req.user.userId,
            ...dto,
        }

        return this.productClient.send(PRODUCT_PATTERNS.CREATE, data);
    }

    @Get()
    findAll() {
        return this.productClient.send(PRODUCT_PATTERNS.FIND_ALL, {});
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productClient.send(PRODUCT_PATTERNS.FIND_ONE, id);
    }

    @Put(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
        const data = {
            id,
            userId: req.user.userId,
            ...dto,
        }
        return this.productClient.send(PRODUCT_PATTERNS.UPDATE, data);
    }

    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        const data = {
            id,
            userId: req.user.userId,
        }
        return this.productClient.send(PRODUCT_PATTERNS.DELETE, data);
    }
}
