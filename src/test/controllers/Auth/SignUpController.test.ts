import supertest from 'supertest'
import app from '../../../index'
import RabbitMQ from '../../../config/rabbitmq'

jest.mock('../../../config/rabbitmq', ()=>({
    publish: jest.fn(),
    consume: jest.fn(),
}))

// TODO: tear down data at end of test

describe('Sign Up', function() {
    test.only('Should sign up a user', async function() {
        const response = await supertest(app).post('/signup')
            .send({ 
                // TODO: use fixtures instead of baking data
                first_name: "El",
                last_name: "unyi",
                email: "unyione12@gmails.com",
                phone: "08123244412",
                password:"p@55w0rd"
            })
            console.log('>>>>>>>> signup >>>>> ', response);
            
        expect(response.status).toBe(200)
        expect(RabbitMQ.publish).toHaveBeenCalled()
    });
});
