process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../Express_Shopping_List/app");
let itemsDB = require("../Express_Shopping_List/fakeDb");

let item = { name: "Chocolate", price: 10 };

beforeEach(function () {
  itemsDB.push(item);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  itemsDB.length = 0;
});

// Test Get all list of items
describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const res = await request(app).get(`/items`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ itemsDB });
  });
});

// /** GET /items/[name] - return data about one name: `{name: name}` */
describe("GET /items/:name", function () {
  test("Get a single item", async function () {
    const res = await request(app).get(`/items/${item.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: item });
  });

  test("Responds with 404 if can't find item", async function () {
    const res = await request(app).get(`/items/abc`);
    expect(res.statusCode).toBe(404);
  });

  // Test POST
  describe("POST /items", function () {
    test("Create a new item", async function () {
      const res = await request(app).post(`/items`).send({
        name: "vitamin_water",
        price: 1.56,
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        added: {
          name: "vitamin_water",
          price: 1.56,
        },
      });
    });
    test("Respond with 400 if name is missing", async function () {
      const res = await request(app).post(`/items`).send({});
      expect(res.statusCode).toBe(400);
    });
  });

  // Test Patch
  describe("PATCH /items/:name", function () {
    test("Update a single item", async function () {
      const res = await request(app).patch(`/items/${item.name}`).send({
        name: "Dark_Chocolate",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        updated: {
          name: "Dark_Chocolate",
          price: 10,
        },
      });
    });

    test("Respond with 404 if invalid", async function () {
      const res = await request(app).patch(`/items/abc`);
      expect(res.statusCode).toBe(404);
    });
  });

  // Test Delete

  describe("DELETE /items/:name", function () {
    test("Delete a single item", async function () {
      const res = await request(app).delete(`/items/${item.name}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: `Deleted ${item.name}` });
    });

    test("Delete if a item is not exist", async function () {
      const res = await request(app).delete(`/items/ddd`);
      expect(res.statusCode).toBe(404);
    });
  });
});
