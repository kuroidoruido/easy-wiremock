import simpleDelete from "../mappings/simple-delete-json.json";
import simpleGet from "../mappings/simple-get-json.json";
import simplePost from "../mappings/simple-post-json.json";
import simplePut from "../mappings/simple-put-json.json";

const BASE_URL = "http://localhost:10888";
const METHODS = ["DELETE", "GET", "POST", "PUT"];
const MAPPINGS = [simpleDelete, simpleGet, simplePost, simplePut];

function makeRequest(method: string, path: string) {
  return fetch(`${BASE_URL}${path}`, { method });
}

(async function () {
  for (let i = 0; i < 20; i++) {
    if (randomOne(["RAND", "STUB"]) === "RAND") {
      // random request
      await makeRequest(randomOne(METHODS), "/rand/" + crypto.randomUUID());
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
