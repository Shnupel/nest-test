import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./review.constants";

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) { }

  @Get("byProduct/:productId")
  async getByProduct(@Param("productId") productId: string){
    return this.reviewService.findById(productId);
  }

  @UsePipes(new ValidationPipe())
  @Post("create")
  @HttpCode(201)
  async create(@Body() reviewModel: CreateReviewDto){
    return await this.reviewService.create(reviewModel);
  }

  @Delete(":id")
  async delete(@Param("id") id: string){
    const deletedReview = await this.reviewService.delete(id);
    if(!deletedReview) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return deletedReview;
  }

  @Delete("byProductId/:productId")
  async deleteByProductId(@Param("productId") productId: string){
    return this.reviewService.deleteByProductId(productId);
  }
}
