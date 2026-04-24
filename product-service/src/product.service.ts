import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async create(data: any) {
    const product = await this.productModel.create(data);

    return product;
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, userId: string, data: any) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized: not product owner');
    }

    Object.assign(product, data);

    await product.save();

    return product;
  }

  async delete(id: string, userId: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized: not product owner');
    }

    await product.deleteOne();

    return { deleted: true };
  }
}