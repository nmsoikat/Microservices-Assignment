import { SchemaFactory } from '@nestjs/mongoose';
import { prop, modelOptions, buildSchema } from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'users',
    },
})
export class User {
    @prop({ required: true, trim: true })
    name!: string;

    @prop({ required: true, trim: true })
    email!: string;

    @prop({ required: true })
    password!: string;

    @prop({ default: true })
    isActive!: boolean;

    @prop({ default: null })
    refreshToken!: string | null;
}


// export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchema = buildSchema(User);