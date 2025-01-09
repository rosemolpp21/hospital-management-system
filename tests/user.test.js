const request = require('supertest');
const patientRouter = require('../routes/user');
const express = require('express');
const server = express();
server.use(express.json());
server.use('/users', patientRouter);
describe('user route', () => {
    describe('POST /users', () => {
        it('return 200', async () => {
            const response = await request(server).post('/users').send({ ID: 104, first_name: 'John', last_name: 'pp', phone_no: '1234567890', gender: 'Male', age: 22, address: 'thrissur', });
            expect(response.status).toBe(200);
            expect(response.text).toBe('patient added susccesfully');
        });
        it('return status 500 ', async () => {
            const response = await request(server).post('/users').send({
                first_name: 'John',
            });
            expect(response.status).toBe(500);
            expect(response.text).toBe('all fields required');
        });
        it('return a valid content type', async () => {
            const response = await request(server).get('/');
            expect(response.headers['content-type']).toMatch(/html/);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user with valid ID', async () => {
            const response = await request(server).put('/users/104').send({ first_name: 'John', last_name: 'Smith', phone_no: '9931251769', gender: 'male', age: 23, address: 'thrissur' });
            expect(response.status).toBe(200);
            expect(response.text).toBe('updated data successfully');
        });
        it('should return 400 if ID is invalid', async () => {
            const response = await request(server)
                .put('/users/abc')
                .send({ first_name: 'John' });
            expect(response.status).toBe(500);
            expect(response.text).toBe('error in updating patient');
        });
        it('return if no value implemented', async () => {
            const response = await request(server).put('/users/104').send({});
            expect(response.status).toBe(500);
            expect(response.text).toBe('minimum 1 field required');
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete a user with valid id', async () => {
            const response = await request(server).delete('/users/104');
            expect(response.status).toBe(200);
            expect(response.text).toContain('patient with ID: 104 deleted from database');
        });
        it('return 400 if ID is not valid', async () => {
            const response = await request(server).delete('/users/abc');
            expect(response.status).toBe(500);
            expect(response.text).toContain('error in deleting patient');
        });
    });
});
