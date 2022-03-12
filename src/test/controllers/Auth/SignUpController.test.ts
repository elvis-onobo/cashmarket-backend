import supertest from 'supertest'
import app from '../../../index'
import RabbitMQ from '../../../config/rabbitmq'
import {newUser} from '../../fixtures/users'

jest.mock('../../../config/rabbitmq', ()=>({
    publish: jest.fn(),
    consume: jest.fn(),
}))

describe('Authenticate User', function() {
    test('Should sign up a user', async function() {
        const response = await supertest(app).post('/signup')
            .send({ 
                first_name: newUser[0].first_name,
                last_name: newUser[0].last_name,
                email: newUser[0].email,
                phone: newUser[0].phone,
                password: newUser[0].password
            })

        expect(response.status).toBe(200)
        expect(RabbitMQ.publish).toHaveBeenCalled()
        expect(RabbitMQ.consume).toHaveBeenCalled()
    });

    test('Should log in a user', async function() {
        const response = await supertest(app).post('/login')
            .send({ 
                email: newUser[0].email,
                password: newUser[0].password
            })
            
        expect(response.status).toBe(200)
    });
});
