import { IsNotEmpty } from 'class-validator';

export class Auth0UserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  auth0user_id: string;

  first_name: string;

  last_name: string;

  phone?: string;

  photo_url?: string;

  email: string;

  date_of_birth?: Date;

  auth0user_token?: string;
}
