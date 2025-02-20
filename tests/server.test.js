const request = require("supertest");
const server = require("../server");
describe("server test", () => {
    it("should return 'Home Page' for the root route", async () => {
        const res = await request(server).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("this is my home page");
    });
    it("return error code", async () => {
        const res = await request(server).get("/a");
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe("error! content is not available");
    });
});