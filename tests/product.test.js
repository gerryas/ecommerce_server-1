const request = require('supertest');
const app = require('../app');
const faker = require('faker');
const { User } = require('../models');
let id, idCust, access_token, access_tokenCust, productId;

beforeAll(async (done) => {
  try {
    const newAdmin = await User.create({
      name: faker.name.findName(),
      email: 'admin@mail.com',
      password: 'asdfgh',
      avatar: faker.image.avatar(),
      role: 'admin'
    });

    const newCust = await User.create({
      name: faker.name.findName(),
      email: 'customer@mail.com',
      password: 'asdfgh',
      avatar: faker.image.avatar(),
      role: ''
    });

    id = newAdmin.id;
    idCust = newCust.id;

    const res1 = await request(app)
    .post('/login')
    .send({
      email: 'customer@mail.com',
      password: 'asdfgh',
    });

    access_tokenCust = res1.body.access_token;

    const res2 = await request(app)
    .post('/login')
    .send({
      email: 'admin@mail.com',
      password: 'asdfgh',
    });

    access_token = res2.body.access_token;

    done();
  } catch (err) {
    done(err);
  }
  
});

afterAll(async (done) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        id: [id, idCust]
      }
    });
    done();
  } catch (err) {
    done(err);
  }
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
      id: expect.any(Number),
      name: 'PS5',
      image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
      price: 11000000,
      stock: 10,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    productId = res.body.id;
    done();
  });

  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED create product when token undefined/false', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', 'abc')
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
  
  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED create product when role is not admin', async (done) => {
    const res = await request(app)
      .post('/products')
      .set('access_token', access_tokenCust)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        error: "You don't have access to do that"
      });
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

describe('Test GET /products', () => {
  // ? SUCCESS GET ALL PRODUCTS TEST CASE
  it('SUCCESS get products', async (done) => {
    const res = await request(app)
      .get('/products')
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([{
      id: expect.any(Number),
      name: expect.any(String),
      image_url: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }]));
    done();
  });

  // ! FAILED GET ALL PRODUCTS WHEN TOKEN UNDEFINED/FALSE
  it('FAILED get products when token undefined/false', async (done) => {
    const res = await request(app)
      .get('/products')
      .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
});

describe('Test GET /products/:productId', () => {
  // ? SUCCESS GET PRODUCT TEST CASE
  it('SUCCESS get product', async (done) => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: productId,
      name: 'PS5',
      image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
      price: 11000000,
      stock: 10,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    done();
  });

  // ! FAILED GET PRODUCT WHEN TOKEN UNDEFINED/FALSE
  it('FAILED get product when token undefined/false', async (done) => {
    const res = await request(app)
    .get(`/products/${productId}`)
    .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
});

describe('Test PUT /products/:productId', () => {
  // ? SUCCESS EDIT PRODUCT TEST CASE
  it('SUCCESS edit product', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set('access_token', access_token)
      .send({
        name: 'PS4',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        price: 4000000,
        stock: 9,
        category: 'game'
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      name: 'PS4',
      image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
      price: 4000000,
      stock: 9,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    done();
  });

  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED edit product when token undefined/false', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set('access_token', 'abc')
      .send({
        name: 'PS4',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        price: 4000000,
        stock: 9,
        category: 'game'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });

  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED edit product when role is not admin', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .set('access_token', access_tokenCust)
      .send({
        name: 'PS4',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        price: 4000000,
        stock: 9,
        category: 'game'
      });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
        error: "You don't have access to do that"
    });
    done();
  });
  
    // ! FAILED TEST CASE WHEN NAME IS EMPTY
  it('Failed edit product when name is empty', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when image_url is empty', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when price is empty', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when stock is empty', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when image is not in url format', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when price is not number', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when price is less than 0', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when stock is not number', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
  it('Failed edit product when stock is less than 0', async (done) => {
    const res = await request(app)
      .put(`/products/${productId}`)
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
})

describe('Test DELETE /products/:productId', () => {
  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED delete product when token undefined/false', async (done) => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });

  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED delete product when role is not admin', async (done) => {
    const res = await request(app)
     .delete(`/products/${productId}`)
      .set('access_token', access_tokenCust);
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
        error: "You don't have access to do that"
    });
    done();
  });

  // ? SUCCESS DELETE PRODUCT TEST CASE
  it('SUCCESS delete product', async (done) => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Product deleted'
    });
    done();
  });
});