import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
