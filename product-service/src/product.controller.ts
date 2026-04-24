import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { PRODUCT_PATTERNS } from './common/constants';
import { ProductOwnerGuard } from './guards/product-owner.guard';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern(PRODUCT_PATTERNS.CREATE)
  create(@Payload() data: any) {
    return this.productService.create(data);
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_ALL)
  findAll() {
    return this.productService.findAll();
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(ProductOwnerGuard)
  @MessagePattern(PRODUCT_PATTERNS.UPDATE)
  update(@Payload() data: any) {
    return this.productService.update(data);
  }

  @UseGuards(ProductOwnerGuard)
  @MessagePattern(PRODUCT_PATTERNS.DELETE)
  delete(@Payload() data: any) {
    return this.productService.delete(data);
  }
}