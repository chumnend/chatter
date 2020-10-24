'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src");

chai.use(chaiHttp);
const expect = chai.expect;

describe("SERVER", function() {
   it("expects server to start listening", function(done) {
        chai.request(app)
            .get("/")
            .end( (err, res) => {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               done();
            });
   });
});
