import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from "./dto/auth.dto";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { compare, genSalt, hash } from "bcryptjs";
import { PASSWORD_NOT_CORRECT, USER_NOT_FOUND_ERROR } from "./auth.constants";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) { }

  async findUser(userEmail: string): Promise<DocumentType<UserModel>>{
    return this.userModel.findOne({ email: userEmail }).exec();
  }

  async createUser(dto: AuthDto): Promise<DocumentType<UserModel>>{
    const salt = await genSalt(10);
    const passwordHashed = await hash(dto.password, salt);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHashed
    });
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<Pick<UserModel, "email">>{
    const user = await this.findUser(email);
    if(!user){
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHashed);
    if(!isCorrectPassword){
      throw new UnauthorizedException(PASSWORD_NOT_CORRECT);
    }
    return { email: user.email };
  }

  async login(email: string){
    const payload = { email };
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
