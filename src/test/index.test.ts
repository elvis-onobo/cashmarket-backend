import {Application} from 'express';
import app from '../index'

describe('Express App Setup', function() {
    test('app should be a function', async function() {
        expect(app).toBeInstanceOf(Function)
    });
});
