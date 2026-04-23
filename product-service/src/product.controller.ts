import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from './common/constants';
import { ProductService } from './product.service';

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

  @MessagePattern(PRODUCT_PATTERNS.UPDATE)
  update(@Payload() data: any) {
    return this.productService.update(data);
  }

  @MessagePattern(PRODUCT_PATTERNS.DELETE)
  delete(@Payload() id: string) {
    return this.productService.delete(id);
  }

  // Optional: if you still want event-based support
  @EventPattern('product.created.event')
  handleCreatedEvent(@Payload() data: any) {
    console.log('Event received:', data);
  }
}