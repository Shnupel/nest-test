import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { ALREADY_REGISTERED } from "./auth.constants";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() user: AuthDto){

  }

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() user: AuthDto){
    const oldUser = await this.authService.findUser(user.login);
    if(oldUser){
      throw new BadRequestException(ALREADY_REGISTERED);
    }
    const newUser = await this.authService.createUser(user);
    delete newUser.passwordHashed;
    return newUser;
  }
}
