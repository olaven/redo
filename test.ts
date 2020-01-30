import {
  assert,
  assertEquals,
  assertNotEquals,
  runTests,
  test
} from "./deps.ts";
import { Redis  } from "./mod.ts"



const redis = await Redis(6379); //start with Docker or similar?

test("clear redis store before other tests", async () => {

    const keys = ["my_key", "first_value", "second_value", "my_num"];
    for await (let key of keys) {

        await redis.delete(key);
    }
});

test("pairs of key/value", async () => {

    const key = "my_key";
    const first = "first_value";
    const second = "second_value";

    await redis.set(key, first);
    const first_retrieved = await redis.get(key);

    await redis.set(key, second);
    const second_retrieved = await redis.get(key);

    assertEquals(first, first_retrieved);
    assertEquals(second, second_retrieved);

    assertNotEquals(first_retrieved, second_retrieved);
})

test("can increment", async () => {

    const key = "my_num";
    const n = 15;

    for (let i = 0; i < n; i++) {

        await redis.increment(key);
    }

    const after = await redis.get(key);
    assertEquals(after, n.toString()); //NOTE: .get returns strings
})

test("increment returns the current value as number", async () => {

    const key  = "my_num";
    const result = await redis.increment(key);

    assert(Number.isInteger(result));
});

test("can delete", async () => {

    const key = "my_key";

    await redis.set(key, "some value");
    const before = await redis.get(key);

    await redis.delete(key);
    const after = await redis.get(key);

    assert(before !== null);
    assert(after === null);
});

runTests();
