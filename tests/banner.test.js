const request = require('supertest');
const app = require('../app');
const faker = require('faker');
const { User } = require('../models');
let id, idCust, access_token, access_tokenCust, bannerId;

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

describe('Test POST /banners', () => {
  // ? SUCCESS CREATE banner TEST CASE
  it('SUCCESS create banner', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        status: false,
        category: 'game'
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(Number),
      title: 'PS5',
      image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
      status: false,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    bannerId = res.body.id;
    done();
  });

  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED create banner when token undefined/false', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', 'abc')
      .send({
        title: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        status: false,
        category: 'game'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
  
  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED create banner when role is not admin', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', access_tokenCust)
      .send({
        title: 'PS5',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        status: false,
        category: 'game'
      });
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        error: "You don't have access to do that"
      });
      done();
    });

  // ! FAILED TEST CASE WHEN NAME IS EMPTY
  it('Failed create banner when title is empty', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', access_token)
      .send({
        title: '',
        image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
        status: false,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Title is required'
    })
    done();
  });

  // ! FAILED TEST CASE WHEN IMAGE_URL IS EMPTY
  it('Failed create banner when image_url is empty', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: '',
        status: false,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image is required,Image has to be in URL format'
    })
    done();
  });

  // ! FAILED TEST CASE WHEN IMAGE IS NOT IN URL FORMAT
  it('Failed create banner when image is not in url format', async (done) => {
    const res = await request(app)
      .post('/banners')
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: 'ps5png',
        status: false,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image has to be in URL format'
    });
    done();
  });

});

describe('Test GET /banners', () => {
  // ? SUCCESS GET ALL banners TEST CASE
  it('SUCCESS get banners', async (done) => {
    const res = await request(app)
      .get('/banners')
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([{
      id: expect.any(Number),
      title: expect.any(String),
      image_url: expect.any(String),
      status: expect.any(Boolean),
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }]));
    done();
  });

  // ! FAILED GET ALL banners WHEN TOKEN UNDEFINED/FALSE
  it('FAILED get banners when token undefined/false', async (done) => {
    const res = await request(app)
      .get('/banners')
      .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
});

describe('Test GET /banners/:bannerId', () => {
  // ? SUCCESS GET banner TEST CASE
  it('SUCCESS get banner', async (done) => {
    const res = await request(app)
      .get(`/banners/${bannerId}`)
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: bannerId,
      title: 'PS5',
      image_url: 'https://cdn.mos.cms.futurecdn.net/4waSNEzfKYTE8rpAkU6FR4.png',
      status: false,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    done();
  });

  // ! FAILED GET banner WHEN TOKEN UNDEFINED/FALSE
  it('FAILED get banner when token undefined/false', async (done) => {
    const res = await request(app)
    .get(`/banners/${bannerId}`)
    .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });
});

describe('Test PUT /banners/:bannerId', () => {
  // ? SUCCESS EDIT banner TEST CASE
  it('SUCCESS edit banner', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      title: 'PS5',
      image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
      status: true,
      CategoryId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    done();
  });

  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED edit banner when token undefined/false', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', 'abc')
      .send({
        title: 'PS5',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });

  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED edit banner when role is not admin', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', access_tokenCust)
      .send({
        title: 'PS5',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
        error: "You don't have access to do that"
    });
    done();
  });
  
    // ! FAILED TEST CASE WHEN TITLE IS EMPTY
  it('Failed edit banner when title is empty', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', access_token)
      .send({
        title: '',
        image_url: 'https://p.ipricegroup.com/uploaded_8ae069a66cfed02ea4c304e9a08b886a.jpg',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Title is required'
    })
    done();
  });

  // ! FAILED TEST CASE WHEN IMAGE_URL IS EMPTY
  it('Failed edit banner when image_url is empty', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: '',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image is required,Image has to be in URL format'
    })
    done();
  });

  // ! FAILED TEST CASE WHEN IMAGE IS NOT IN URL FORMAT
  it('Failed edit banner when image is not in url format', async (done) => {
    const res = await request(app)
      .put(`/banners/${bannerId}`)
      .set('access_token', access_token)
      .send({
        title: 'PS5',
        image_url: 'ps5png',
        status: true,
        category: 'game'
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Image has to be in URL format'
    });
    done();
  });

})

describe('Test DELETE /banners/:bannerId', () => {
  // ! FAILED TEST CASE WHEN TOKEN UNDEFINED/FALSE
  it('FAILED delete banner when token undefined/false', async (done) => {
    const res = await request(app)
      .delete(`/banners/${bannerId}`)
      .set('access_token', 'abc');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: "You don't have access to do that"
    });
    done();
  });

  // ! FAILED TEST CASE WHEN ROLE IS NOT ADMIN
  it('FAILED delete banner when role is not admin', async (done) => {
    const res = await request(app)
     .delete(`/banners/${bannerId}`)
      .set('access_token', access_tokenCust);
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
        error: "You don't have access to do that"
    });
    done();
  });

  // ? SUCCESS DELETE banner TEST CASE
  it('SUCCESS delete banner', async (done) => {
    const res = await request(app)
      .delete(`/banners/${bannerId}`)
      .set('access_token', access_token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Banner deleted'
    });
    done();
  });
});