import { prop, getModelForClass, modelOptions, buildSchema } from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'products',
    },
})
export class Product {
    @prop({ required: true, trim: true })
    name: string;

    @prop({ required: false })
    description: string;

    @prop({ required: true })
    price: number;

    @prop({ default: 0 })
    stock: number;

    @prop({ required: true })
    createdBy: string;
}

export const ProductSchema = buildSchema(Product);