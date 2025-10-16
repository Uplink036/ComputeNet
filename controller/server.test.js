const request = require('supertest');

jest.mock('mongodb', () => {
  let taskCounter = 1;
  return {
    MongoClient: {
      connect: jest.fn().mockResolvedValue({
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            findOneAndUpdate: jest.fn().mockImplementation(() => ({ number: taskCounter++ })),
            insertOne: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue({ number: 10 }),
          }),
        }),
      }),
    },
  };
});

delete require.cache[require.resolve('./server')];
const {app, server} = require('./server');

describe('ComputeNet API', () => {
  afterAll(() => {
      server.close();
  });
    

  test('GET / returns 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /api/task returns incrementing task numbers', async () => {
    const response1 = await request(app).get('/api/task');
    expect(response1.body).toEqual({ task: 1 });

    const response2 = await request(app).get('/api/task');
    expect(response2.body).toEqual({ task: 2 });
  });


  test('POST /api/task/submit sumbit a task', async () => {
    const response0 = await request(app).post('/api/task/submit').send({});
    expect(response0.body).toEqual({ success: false });

    const response1 = await request(app).post('/api/task/submit').send({task: 1, result: 1});
    expect(response1.body).toEqual({ success: true });

    const response2 = await request(app).post('/api/task/submit').send({task: 2, result: 1});
    expect(response2.body).toEqual({ success: true });

    const response3 = await request(app).post('/api/task/submit').send({task: 3, result: 7});
    expect(response3.body).toEqual({ success: true });
  });
});
