'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Application Test', function() {
  it('expects server to start listening', function(done) {
    chai.request(app)
      .get('/')
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('expects to get a page not found', (done) => {
    chai.request(app)
      .get('/does-not-exist')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('extra');
        done();
      })
  });
});
