import supertest from 'supertest'
import app from '../../index'
import {newUser} from '../fixtures/users'

describe('Tranfer Funds', function() {
    test('Should process internal app tranfer', async function() {
        const response = await supertest(app).post('/transfer')
            .set('Authorization', 'Bearer ' + newUser[1].token)
            .send({
                "email":"unyione12@gmails.com",
                "amount": 100
            })

        expect(response.status).toBe(200)
    });
});
