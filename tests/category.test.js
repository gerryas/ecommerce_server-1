const request = require('supertest');
const app = require('../app');
const faker = require('faker');
const { User, Product } = require('../models');
let id, access_token, productId;

beforeAll(async (done) => {
  try {
    const newUser = await User.create({
      name: faker.name.findName(),
      email: 'admin@mail.com',
      password: 'asdfgh',
      avatar: faker.image.avatar(),
      role: 'admin'
    });

    id = newUser.id;

    const res = await request(app)
    .post('/login')
    .send({
      email: 'admin@mail.com',
      password: 'asdfgh',
    });

    access_token = res.body.access_token;

    const product = await request(app)
      .post('/products')
      .set('access_token', access_token)
      .send({
        name: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        price: 11000000,
        stock: 10,
        category: 'game'
      });

    productId = product.body.id;

    done();
  } catch (err) {
    done(err);
  }
  
});

afterAll(async (done) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        id
      }
    });

    const deleteProduct = await Product.destroy({
      where: {
        id: productId
      }
    })
    done();
  } catch (err) {
    done(err);
  }
})

describe('Test GET /categories', () => {
  // ? SUCCESS GET ALL CATEGORIES TEST CASE
  it('SUCCESS get categories', async (done) => {
    const res = await request(app)
      .get('/categories')
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([{
      id: expect.any(Number),
      name: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      Products: expect.arrayContaining([{
        id: expect.any(Number),
        name: expect.any(String),
        image_url: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
        CategoryId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)  
      }])
    }]));
    done();
  });

  // ! FAILED GET ALL CATEGORIES WHEN TOKEN UNDEFINED/FALSE
  it('FAILED get categories when token undefined/false', async (done) => {
    const res = await request(app)
      .get('/categories')
      .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
});
