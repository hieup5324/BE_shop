import { BadRequestException, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/modules/users/user.repository';
import { Auth0UserDto } from 'src/modules/users/userDTO/auth0-user.dto';
import { CartRepository } from 'src/modules/cart/cart.repository';

@Injectable()
export class GoogleService {
  private readonly googleOAuth2Client: OAuth2Client;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly cartRepo: CartRepository,
    private jwtService: JwtService,
  ) {
    this.googleOAuth2Client = new OAuth2Client({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      redirectUri: 'http://localhost:3001/login-google',
    });
  }

  async googleLogin(req) {
    const user = req.user;
    const hashedPw = await bcrypt.hash(user.email, 10);
    const newUser: Auth0UserDto = {
      auth0user_id: user.googleId,
      email: user.email,
      password: hashedPw,
      first_name: user.firstName,
      last_name: user.lastName,
      photo_url: user.picture,
      phone: user.phoneNumber || null,
      auth0user_token: user.accessToken,
    };
    const userdb = await this.userRepository.findOne({
      where: { email: newUser.email },
    });
    const token = await this.generateToken(newUser);
    if (userdb) {
      return {
        msg: 'đăng nhập thành công',
        ...token,
        user: userdb,
      };
    }
    await this.addUser(newUser);
    return {
      msg: 'đăng nhập thành công',
      ...token,
      user: newUser,
    };
  }

  async addUser(user: Auth0UserDto) {
    const createdUser = await this.userRepository.save(user);
    await this.cartRepo.save({
      user: createdUser,
    });
  }

  async logout(token: string) {
    await this.revokeAccessToken(token);
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    await this.googleOAuth2Client.revokeToken(accessToken);
  }

  async generateToken(user: any) {
    const access_token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = await this.jwtService.signAsync(user, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }
}
