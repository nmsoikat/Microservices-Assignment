import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products: any[] = [];

  create(data: any) {
    const product = {
      id: Date.now().toString(),
      ...data,
    };

    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find(p => p.id === id);
  }

  update(data: any) {
    const product = this.products.find(p => p.id === data.id);

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, data);
    return product;
  }

  delete(id: string) {
    const exists = this.products.find(p => p.id === id);

    if (!exists) {
      throw new Error('Product not found');
    }

    this.products = this.products.filter(p => p.id !== id);

    return { deleted: true };
  }
}