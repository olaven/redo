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

    const keys = ["my_key", "first_value", "second_value", "my_num", "my_array"];
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

test("can store arrays", async () => {

    const key = 'my_array';
    const first = "first_array_value";
    const second = "second_array_value";

    await redis.array(key).append(first);
    await redis.array(key).append(second);

    const retrieved = await redis.array(key).get();

    assertEquals(true, retrieved.includes(first))
    assertEquals(true, retrieved.includes(second))
    assertEquals(retrieved.length, 2);
});

test("can get specified range", async () => {

    const key = 'my_array';
    const n = 10;
    const wanted = 5;

    for (let i = 0; i < n; i++) {
        await redis.array(key).append("value");
    }

    const retrieved = await redis.array(key).get(0, wanted - 1);
    assertEquals(retrieved.length, wanted);

    const all = await redis.array(key).get();
    assert(all.length > wanted);
});


runTests();
