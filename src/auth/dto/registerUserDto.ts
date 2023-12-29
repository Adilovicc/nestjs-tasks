import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Password must have at least 6 and max 20 characters',
  })
  password: string;

  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
