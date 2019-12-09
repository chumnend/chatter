const app = require("../app");

const chai = require("chai");
const expect = chai.expect;
const chai_http = require("chai-http");
chai.use(chai_http);

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