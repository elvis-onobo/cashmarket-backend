import supertest from 'supertest'
import app from '../../index'
import {newUser} from '../fixtures/users'
import Paystack from '../../config/axios-paystack'

jest.mock('../../config/axios-paystack')
const mockedAxios = jest.mocked(Paystack, true)

const res = { 
    status: true,
    data: {
        bank: {
            name: 'Zenith Bank',
            slug: 'zenith-bank',
        },
        account_name: 'Elvis Onobo',
        account_number: '2003560903'
    }
}

describe('Create Account', function() {
    test.only('should create an account for a user', async function() {
        mockedAxios.post.mockResolvedValue({ data: res})

        const response = await supertest(app).get('/create-account')
            .set('Authorization', 'Bearer ' + newUser[1].token)

        expect(response.status).toBe(200)
        expect(mockedAxios.post).toHaveBeenCalled()
    });
});