import supertest from 'supertest'
import app from '../../index'
import {newUser} from '../fixtures/users'
import Paystack from '../../config/axios-paystack'

jest.mock('../../config/axios-paystack')
const mockedAxios = jest.mocked(Paystack, true)

const res = { 
    status: true,
    data: {
        reference: 'd1fu2c5zfvHtam'
    }
}

describe('Withdrawal', function() {
    test('should successfully process withdrawals', async function() {
        mockedAxios.post.mockResolvedValue({ data: res})

        const response = await supertest(app).post('/withdraw')
            .set('Authorization', 'Bearer ' + newUser[1].token)
            .send({
                "amount":10,
                "reason":"Holiday"
            })

        expect(response.status).toBe(202)
        expect(mockedAxios.post).toHaveBeenCalled()
    });

    test('should respond if user has insufficient funds', async function() {
        mockedAxios.post.mockResolvedValue({ data: res})

        const response = await supertest(app).post('/withdraw')
            .set('Authorization', 'Bearer ' + newUser[1].token)
            .send({
                "amount":1000000000,
                "reason":"Holiday"
            })

        expect(response.status).toBe(422)
    });
});