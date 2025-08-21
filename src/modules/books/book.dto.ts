import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsBase64,
  MaxLength,
  Min,
  Max,
  Length,
} from "class-validator";
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear())
  year!: number;

  @IsString()
  @IsNotEmpty()
  @Length(10, 13)
  isbn!: string;

  @IsBase64()
  @IsNotEmpty()
  coverBase64!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  review?: string | null;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  review?: string;
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
  @IsString()
  @IsOptional()
  @Length(10, 13)
  isbn?: string;
}
