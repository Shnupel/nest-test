import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from "./dto/auth.dto";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { compare, genSalt, hash } from "bcryptjs";
import { PASSWORD_NOT_CORRECT, USER_NOT_FOUND_ERROR } from "./auth.constants";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
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

  async validateUser(email: string, password: string){
    const user = await this.findUser(email);
    if(!user){
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = compare(password, user.passwordHashed);
    if(!isCorrectPassword){
      throw new UnauthorizedException(PASSWORD_NOT_CORRECT);
    }
  }
}
