import supertest from 'supertest'
import app from '../../index'

describe('Health Check', function() {
    test('Should receive a 200', async function() {
        const response = await supertest(app).get('/healthcheck')
        expect(response.status).toBe(200)
    });
});
