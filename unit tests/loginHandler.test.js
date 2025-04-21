
/**
 * @jest-environment jsdom
 */

const { loginUser } = require("../js/loginHandler.js"); // make sure path is correct

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockReset();
});

test("returns error if fields are empty", async () => {
  const result = await loginUser("", "");
  expect(result).toBe("Please fill in all fields");
});

test("returns success on valid login", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token: "fakeToken" }),
  });

  const result = await loginUser("test@example.com", "123456");
  expect(result).toBe("Success");
});

test("returns custom error on invalid credentials", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: "Invalid credentials" }),
  });

  const result = await loginUser("wrong@example.com", "wrongpass");
  expect(result).toBe("Invalid credentials");
});

test("returns fallback error if no error message from backend", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  });

  const result = await loginUser("fail@example.com", "fail");
  expect(result).toBe("Login failed");
});

test("returns network error on fetch rejection", async () => {
  fetch.mockRejectedValueOnce(new Error("Network error"));

  const result = await loginUser("a@a.com", "pass");
  expect(result).toBe("Network error");
});
