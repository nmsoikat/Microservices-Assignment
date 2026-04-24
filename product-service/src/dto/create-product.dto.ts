import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsNotEmpty()
    userId: string;
}
