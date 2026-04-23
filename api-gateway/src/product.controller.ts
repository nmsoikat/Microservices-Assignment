import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { PRODUCT_PATTERNS, PRODUCT_SERVICE_RMQ } from './common/constants';

@Controller('product')
export class ProductController {
    constructor(
        @Inject(PRODUCT_SERVICE_RMQ) private productClient: ClientProxy,
    ) { }

    @Post()
    create(@Body() dto: any) {
        return this.productClient.emit(PRODUCT_PATTERNS.CREATE, dto);
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
    update(@Param('id') id: string, @Body() dto: any) {
        return this.productClient.emit(PRODUCT_PATTERNS.UPDATE, { id, ...dto });
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.productClient.emit(PRODUCT_PATTERNS.DELETE, id);
    }
}
