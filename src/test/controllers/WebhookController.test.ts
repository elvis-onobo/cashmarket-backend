import supertest from 'supertest'
import app from '../../index'
import { ecryptedHeader } from '../fixtures/webhookEncryptedHeader'
import { webhookPayload } from '../fixtures/webhookPayload'

describe('Should be called when a webhook message is received', function() {
    test('Should trigger data processing through queue service once data is received', async function() {
        const response = await supertest(app)
            .post('/webhook')
            .set('x-paystack-signature', ecryptedHeader.code)
            .set('Content-Type', 'application/json')
            .send(webhookPayload)
                    
        expect(response.status).toBe(200)   
    })
})
