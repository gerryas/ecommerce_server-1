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

  // ! FAILED TEST CASE WHEN NAME IS EMPTY
  it('Failed create product when name is empty', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: '',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Name is required'
    })
    done();
  });

    // ! FAILED TEST CASE WHEN IMAGE_URL IS EMPTY
    it('Failed create product when image_url is empty', async (done) => {
      const res = await request(app)
        .post('/products')
        .set('access_token', access_token)
        .send({
          name: 'PS5',
          image_url: '',
          price: 11000000,
          stock: 10,
          category: 'game'
        });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Image is required,Image has to be in URL format'
      })
      done();
    });

  // ! FAILED TEST CASE WHEN PRICE IS EMPTY
  it('Failed create product when price is empty', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: '',
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Price is required,Price has to be in number format'
    })
    done();
  });


  // ! FAILED TEST CASE WHEN STOCK IS EMPTY
  it('Failed create product when stock is empty', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: '',
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Stock is required,Stock has to be in number format'
    })
    done();
  });

  // ! FAILED TEST CASE WHEN IMAGE IS NOT IN URL FORMAT
  it('Failed create product when image is not in url format', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'ps5png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image has to be in URL format'
    });
    done();
  });

  // ! FAILED TEST CASE WHEN PRICE IS NOT NUMBER
  it('Failed create product when price is not number', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 'a',
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Price has to be in number format'
    });
    done();
  });
 
  // ! FAILED TEST CASE WHEN PRICE IS LESS THAN 0
  it('Failed create product when price is less than 0', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: -1,
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Price must be greater than or equal to 0'
    });
    done();
  });

  // ! FAILED TEST CASE WHEN STOCK IS NOT NUMBER
  it('Failed create product when stock is not number', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 'a',
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Stock has to be in number format'
    });
    done();
  });

  // ! FAILED TEST CASE WHEN STOCK IS LESS THAN 0
  it('Failed create product when stock is less than 0', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: -1,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Stock must be greater than or equal to 0'
    });
    done();
  });

});