import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';

export class AddressTimestampsDto {
  created_at: Date;
  updated_at: Date;
}

export class AddressIdDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class UserIDDto {
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  user_id: string;
}

export class AddressDto {
  @IsNotEmpty()
  full_name: string;

  @IsOptional()
  phone: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsOptional()
  @Matches(/^[0-9]{4,10}$/, {
    message: 'postal_code must be 4–10 digits',
  })
  postal_code?: string;

  @IsNotEmpty()
  street: string;

  @IsOptional()
  house?: string;

  @IsNotEmpty()
  apartment: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  is_default: boolean = false;
}

export class GetAddressReqDto extends AddressIdDto {}

export class GetAddressResDto extends IntersectionType(
  AddressIdDto,
  UserIDDto,
  AddressDto,
  AddressTimestampsDto,
) {}

export class GetAddressesReqDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsString()
  @IsOptional()
  user_id: string;
}

export class GetAddressesResDto extends IntersectionType(
  AddressIdDto,
  UserIDDto,
  AddressDto,
) {}

export class AddAddressReqDto extends IntersectionType(UserIDDto, AddressDto) {}

export class AddAddressResDto extends IntersectionType(
  AddressIdDto,
  UserIDDto,
  AddressDto,
) {}

export class EditAddressReqDto extends IntersectionType(
  UserIDDto,
  AddressDto,
) {}

export class EditAddressResDto extends IntersectionType(
  AddressIdDto,
  UserIDDto,
  AddressDto,
  AddressTimestampsDto,
) {}

export class DeleteAddressReqDto extends AddressIdDto {}
