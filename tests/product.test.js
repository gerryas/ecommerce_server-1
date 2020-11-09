const request = require('supertest');
const app = require('../app');
let access_token;

beforeAll(async (done) => {
  
  const res = await request(app)
    .post('/login')
    .send({
      email: 'admin@mail.com',
      password: '1234',
    });
    access_token = res.body.access_token;
  done();
})

describe('Test POST /products', () => {
  // ? SUCCESS CREATE PRODUCT TEST CASE
  it('SUCCESS create product', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      name: 'PS5',
      image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
      price: 11000000,
      stock: 10,
      CategoryId: expect.any(Number)
    });
    console.log(res.body);
    done();
  });

  // ! FAILED TEST CASE WHEN ALL FIELDS ARE EMPTY (EXCLUDED CATEGORY)
  it('Failed create product when fields empty', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: '',
        image_url: '',
        price: '',
        stock: '',
        category: ''
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Name is required,Image is required,Image has to be in URL format,Price is required,Stock is required'
    })
    done();
  });


  // ! FAILED TEST CASE WHEN IMAGE IS NOT IN URL FORMAT AND/OR PRICE IS LESS THAN 0 AND/OR STOCK IS LESS THAN 0
  it('Failed create product', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'ps5png',
        price: -1,
        stock: -1,
        category: ''
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image has to be in URL format,Price must be greater than or equal to 0,Stock must be greater than or equal to 0'
    });
    done();
  });
  
});