import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { PRODUCT_PATTERNS } from './common/constants';
import { ProductOwnerGuard } from './guards/product-owner.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern(PRODUCT_PATTERNS.CREATE)
  create(@Payload() data: CreateProductDto) {
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
  update(@Payload() data: UpdateProductDto) {
    return this.productService.update(data);
  }

  @UseGuards(ProductOwnerGuard)
  @MessagePattern(PRODUCT_PATTERNS.DELETE)
  delete(@Payload() data: DeleteProductDto) {
    return this.productService.delete(data);
  }
}