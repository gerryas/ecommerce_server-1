const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const faker = require('faker');

let id;

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
    done();
  } catch (err) {
    done(err);
  }
})

describe('Test POST /login', () => {
  // ? SUCCESS TEST CASE
  it('SUCCESS login', async (done) => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'admin@mail.com',
        password: 'asdfgh',
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      access_token: expect.any(String),
      name: expect.any(String),
      email: 'admin@mail.com',
      avatar: expect.any(String),
      role: 'admin'
    });
    done();
  });

  // ! TEST CASE WHEN EMAIL NOT REGISTERED
  it('Failed login email not registered', async (done) => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'a@mail.com',
        password: 'asdfgh',
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid Email or Password'
    });
    done();
  });

  // ! TEST CASE WHEN PASSWORD FALSE
  it('Failed login invalid password', async (done) => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'admin@mail.com',
        password: 'asdfghj',
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid Email or Password'
    });
    done();
  });

  // ! TEST CASE WHEN PASSWORD AND/OR EMAIL EMPTY
  it('Failed login empty email/password', async (done) => {
    const res = await request(app)
      .post('/login')
      .send({
        email: '',
        password: '',
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid Email or Password'
    });
    done();
  });  
});