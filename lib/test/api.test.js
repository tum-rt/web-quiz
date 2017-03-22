/* eslint-env mocha */
process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-http"));
const expect = chai.expect;
const app = require("../../server.js");

describe("server", () => {
    describe("GET /api/tags_with_count", () => {
        it("should return total count for each tag if no filter given",
        (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    expect(pair.tag).to.be.a("string");
                    expect(pair.count).to.be.at.least(1);
                });
                expect(res.body.data.total).to.equal(6);
                done();
            });
        });

        it("should only return 2 for animals", (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .query({"tags": "animals"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    if(pair.tag === "animals") {
                        expect(pair.count).to.equal(2);
                    } else {
                        expect(pair.count).to.equal(0);
                    }
                });
                expect(res.body.data.total).to.equal(2);
                done();
            });
        });

        it("should give 0 for invalid tag combination", (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .query({tags: "animals|development"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    expect(pair.count).to.equal(0);
                });
                expect(res.body.data.total).to.equal(0);
                done();
            });
        });
    });

    describe("GET /api/quiz", () => {
        it("should return all if no filter given", (done) => {
            chai.request(app)
            .get("/api/quiz")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.have.lengthOf(6);
                done();
            });
        });
    });

    describe("GET /api/math/tex/svg", () => {
        it("should return SVG for simple math", function(done) {
            this.timeout(5000);
            chai.request(app)
            .get("/api/math/tex/svg")
            .query({input: "1+1"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("content-type", /^image\/svg\+xml/);
                expect(res.body.length).to.be.above(0);
                done();
            });
        });

        it("should fail if no input given", (done) => {
            chai.request(app)
            .get("/api/math/tex/svg")
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("fail");
                done();
            });
        });

        it("should fail if input is empty", (done) => {
            chai.request(app)
            .get("/api/math/tex/svg")
            .query({input: ""})
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("fail");
                done();
            });
        });

        it("should fail if input is too long", (done) => {
            chai.request(app)
            .get("/api/math/tex/svg")
            .query({input: "x".repeat(2000)})
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("fail");
                done();
            });
        });
    });

    describe("GET /public/*", () => {
        it("should expose favicon.png", (done) => {
            chai.request(app)
            .get("/public/favicon.png")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("content-type", "image/png");
                done();
            });
        });

        it("should deny access to _config.yml", (done) => {
            chai.request(app)
            .get("/public/_config.yml")
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(403);
                done();
            });
        });
    });

    describe("GET /", () => {
        it("should return HTML and use security headers", (done) => {
            chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("content-type", /^text\/html/);
                expect(res).to.have.header("content-security-policy");
                expect(res).to.have.header("x-content-type-options");
                expect(res).to.have.header("x-frame-options");
                expect(res).to.have.header("x-xss-protection");
                done();
            });
        });
    });
});
