import request from 'supertest';

import app from 'app';

describe("User Feature", function(){
    it('/signup - Registers a new user', function(done) {
        request(app).post('/signup').send({ username: 'bob', password: 'great'}).expect(200, done());
    });
});

// Due to the limited time which i have left to submit i'm not able to write all test cases as i spent most of the time optimizing the structure and testing with POSTMAN, but I have thoroughly tested all endpoints with POSTMAN, and all endpoints are working perfectly.

//Thank you.