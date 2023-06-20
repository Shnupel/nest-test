import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReviewModel } from "./review.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Types } from "mongoose";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>
  ) { }

  async findById(id: string): Promise<DocumentType<ReviewModel>[]>{
    return this.reviewModel.find({
      productId: new Types.ObjectId(id)
    }).exec();
  }
  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType<ReviewModel> | null>{
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async deleteByProductId(id: string) {
    return this.reviewModel.deleteMany({ productId: new Types.ObjectId(id) }).exec();
  }
}
