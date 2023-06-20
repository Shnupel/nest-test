import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Query } from '@nestjs/common';
import { ProductModel } from "./product.model";
import { FindProductDto } from "./dto/find-product.dto";

@Controller('product')
export class ProductController {

  @Post("create")
  @HttpCode(201)
  async create(@Body() product: Omit<ProductModel, "_id">){

  }

  @Get(":id")
  async get(@Query("id") id: string){

  }

  @Delete(":id")
  async delete(@Query("id") id: string){}

  @Patch(":id")
  async patch(@Query("id") id: string, @Body() product: ProductModel){

  }

  @Post("")
  @HttpCode(200)
  async find(@Body() dto: FindProductDto){
    
  }
}
