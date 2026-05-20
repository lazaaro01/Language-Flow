import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Email do usuário', example: 'usuario@exemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;
}
