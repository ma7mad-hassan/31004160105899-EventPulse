const request = require('supertest');
const app = require('../../app');

describe('Events API Integration Tests', () => {

  test('GET /api/events should return status 200 OK and an array of events', async () => {
    const response = await request(app).get('/api/events');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data || response.body)).toBe(true);
  });


  test('POST /api/events without a JWT token should return 401 Unauthorized', async () => {
    const response = await request(app)
      .post('/api/events')
      .send({
        title: 'Unauthorized Test Event',
        category: '60c72b2f9b1d8b2a4c8e4b1a',
        date: '2026-10-01',
        capacity: 50,
      });

    expect(response.statusCode).toBe(401);
  });
  test('POST /api/events with missing required fields should return 422 Unprocessable Entity', async () => {
    const response = await request(app)
      .post('/api/events')

      .set('Authorization', 'Bearer fake_or_valid_token_here') 
      .send({
        capacity: 10,
      });

    expect(response.statusCode).toBe(422);
  });

});