import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../models/product.model';
import { MicroserviceException } from 'src/common/exceptions/microservice.exception';

@Injectable()
export class ProductOwnerGuard implements CanActivate {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { id, userId } = context.switchToRpc().getData();

        const product = await this.productModel.findById(id);
        if (!product) {
            throw new MicroserviceException('Product not found');
        }

        if (product.createdBy.toString() !== userId) {
            throw new MicroserviceException('Unauthorized: not product owner', 'UNAUTHORIZED');
        }

        return true;
    }
}