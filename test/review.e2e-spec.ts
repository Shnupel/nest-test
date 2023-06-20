import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from "../src/review/dto/create-review.dto";
import { Types, disconnect } from "mongoose";

const mockProductId = new Types.ObjectId().toHexString();

const mockData: CreateReviewDto = {
  name: "test",
  title: "Заголовок",
  description: "Описание тестовое",
  rating: 5,
  productId: mockProductId
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)',(done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(mockData)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      })
  });

  it(`/review/byProduct/:productId (GET)`,(done) => {
    request(app.getHttpServer())
      .get('/review/byProduct/' + mockProductId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        done();
      })
  });

  it(`/review/:id (DELETE)`,(done) => {
    request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(200)
      .then(() => done())
  });

  afterAll(() => disconnect());
});
