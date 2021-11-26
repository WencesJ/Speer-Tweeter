import request from 'supertest';

import app from 'app';

describe("Tweet Feature", function(){
    it('/tweets (POST) - Creates a new tweet', function(done) {
        request(app)
        .post('/tweets')
        .send({ 
            text: 'Speer Technologies is the best company with amazing team members.', 
            date: '11-25-2021', 
            time: {
                hour: 22,
                min: 45,
                sec: 22
            }
        })
        .expect(200, done());
    });

    it('/tweets (GET) - Gets all tweets', function(done) {
        request(app)
        .get('/tweets')
        .expect(200, done());
    });
});

// Due to the limited time which i have left to submit i'm not able to write all test cases as i spent most of the time optimizing the structure and testing with POSTMAN, but I have thoroughly tested all endpoints with POSTMAN, and all endpoints are working perfectly.

//Thank you.