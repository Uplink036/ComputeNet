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
});
