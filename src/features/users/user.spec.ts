import request from 'supertest';

import app from 'app';

describe("User Feature", function(){
    it('/signup - Registers a new user', function(done) {
        request(app).post('/signup').send({ username: 'bob', password: 'great'}).expect(200, done());
    });
})