const request = require('supertest');
const express = require('express');
const homeRouter = require('../routes/home');
const app = express();
app.use('/', homeRouter);
describe('home router', () => {
    it('give home page 200 status', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('this is my home page');
    });
    it('return valid content type', async () => {
        const response = await request(app).get('/');
        expect(response.headers['content-type']).toMatch(/html/);
    });
});


