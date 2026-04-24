import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';
import { MicroserviceException } from './common/exceptions/microservice.exception';
import { ResponseHelper } from './common/responses/response.helper';

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

    return ResponseHelper.success('Product created successfully', newProduct);
  }

  async findAll() {
    const products = await this.productModel.find();
    return ResponseHelper.success('Products found successfully', products);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    return ResponseHelper.success('Product found successfully', product);
  }

  async update(data: any) {
    const { id, ...rest } = data;
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    Object.assign(product, rest);

    await product.save();

    return ResponseHelper.success('Product updated successfully', product);
  }

  async delete(data: any) {
    const { id } = data;
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new MicroserviceException('Product not found');
    }

    await product.deleteOne();

    return ResponseHelper.success('Product deleted successfully', {});
  }
}