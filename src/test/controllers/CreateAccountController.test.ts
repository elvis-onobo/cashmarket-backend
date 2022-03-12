import supertest from 'supertest'
import app from '../../index'
import {newUser} from '../fixtures/users'
// import {Paystack} from '../../config/axios-paystack'

jest.mock('../../config/axios-paystack')

describe('Create Account', function() {
    test('should return a 200 status', async function() {
        const response = await supertest(app).get('/create-account')
            .set('Authorization', 'Bearer ' + newUser[1].token)

        // expect(Paystack).toHaveBeenCalled()
        expect(response.status).toBe(200)
    });
});
