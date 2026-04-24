import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';
import { MicroserviceException } from './common/exceptions/microservice.exception';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) { }

  async create(data: any) {
    const { userId, ...rest } = data;

    const product = {
      ...rest,
      createdBy: userId,
    }

    const newProduct = await this.productModel.create(product);

    return newProduct;
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    return product;
  }

  async update(data: any) {
    const { id, userId, ...rest } = data;
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    if (product.createdBy.toString() !== userId) {
      throw new MicroserviceException('Unauthorized: not product owner');
    }

    Object.assign(product, rest);

    await product.save();

    return product;
  }

  async delete(data: any) {
    const { id, userId } = data;
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    if (product.createdBy.toString() !== userId) {
      throw new MicroserviceException('Unauthorized: not product owner');
    }

    await product.deleteOne();

    return { deleted: true };
  }
}