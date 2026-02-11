import simpleDelete from "../mappings/simple-delete-json.json";
import simpleGet from "../mappings/simple-get-json.json";
import simplePost from "../mappings/simple-post-json.json";
import simplePut from "../mappings/simple-put-json.json";

const BASE_URL = "http://localhost:10888";
const METHODS = ["DELETE", "GET", "POST", "PUT"];
const MAPPINGS = [simpleDelete, simpleGet, simplePost, simplePut];
const VALUE_SAMPLES = [
  4,
  555444,
  "foo",
  "bar",
  "http://example.com",
  "THIS IS SPARTA!",
  "I ❤️ Wiremock",
  { I: { love: "Wiremock" } },
];

function makeRequest(method: string, path: string, body?: string) {
  return fetch(`${BASE_URL}${path}`, { method, body });
}

(async function () {
  for (let i = 0; i < 20; i++) {
    if (randomOne(["RAND", "STUB"]) === "RAND") {
      // random request
      const method = randomOne(METHODS);
      const body =
        method === "GET"
          ? undefined
          : JSON.stringify(
              Object.fromEntries(
                crypto
                  .randomUUID()
                  .split("-")
                  .map((k) => [k, randomOne(VALUE_SAMPLES)]),
              ),
            );
      await makeRequest(method, "/rand/" + crypto.randomUUID(), body);
    } else {
      // stub request
      const stub = randomOne(MAPPINGS);
      await makeRequest(stub.request.method, stub.request.url);
    }
    await new Promise((r) => setTimeout(r, 1_000));
  }
})();

function randomOne<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
