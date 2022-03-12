import supertest from 'supertest'
import app from '../../../index'
import RabbitMQ from '../../../config/rabbitmq'
import {user1} from '../../fixtures/users'

jest.mock('../../../config/rabbitmq', ()=>({
    publish: jest.fn(),
    consume: jest.fn(),
}))

describe('Authenticate User', function() {
    test('Should sign up a user', async function() {
        const response = await supertest(app).post('/signup')
            .send({ 
                first_name: user1.first_name,
                last_name: user1.last_name,
                email: user1.email,
                phone: user1.phone,
                password: user1.password
            })

        expect(response.status).toBe(200)
        expect(RabbitMQ.publish).toHaveBeenCalled()
        expect(RabbitMQ.consume).toHaveBeenCalled()
    });

    test('Should log in a user', async function() {
        const response = await supertest(app).post('/login')
            .send({ 
                email: user1.email,
                password: user1.password
            })
            
        expect(response.status).toBe(200)
    });
});
