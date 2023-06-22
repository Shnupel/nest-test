import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserEmail } from "../decorators/user-email.decorator";

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  @Get("byProduct/:productId")
  async getByProduct(@Param("productId") productId: string){
    return this.reviewService.findById(productId);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post("create")
  @HttpCode(201)
  async create(@Body() reviewModel: CreateReviewDto){
    return await this.reviewService.create(reviewModel);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string){
    const deletedReview = await this.reviewService.delete(id);
    if(!deletedReview) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return deletedReview;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("byProductId/:productId")
  async deleteByProductId(@Param("productId") productId: string){
    return this.reviewService.deleteByProductId(productId);
  }
}
