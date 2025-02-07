import { IsNotEmpty } from 'class-validator';

export class Auth0UserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  auth0userId: string;

  firstName: string;

  lastName: string;

  phone?: string;

  photoUrl?: string;

  address?: string;

  email: string;

  dateOfBirth?: Date;

  auth0user_token?: string;
}
