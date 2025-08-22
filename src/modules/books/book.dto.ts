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
  @MaxLength(500)
  review!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  author?: string;

  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear())
  @IsOptional()
  year?: number;

  @IsBase64()
  @IsNotEmpty()
  @IsOptional()
  coverBase64?: string;
}
