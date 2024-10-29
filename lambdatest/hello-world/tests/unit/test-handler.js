'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const event = {};    // Define event if needed
        const context = {};  // Define context if needed

        const result = await app.lambdaHandler(event, context);

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.a('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.a('string');
        expect(response).to.equal('Token sent successfully');
    });
});
