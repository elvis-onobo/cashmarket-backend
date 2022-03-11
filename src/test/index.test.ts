import {Application} from 'express';
import app from '../index'

describe('Test App', function() {
    test.only('app should be a function', async function() {
        expect(app).toBeInstanceOf(Function)
    });
});
