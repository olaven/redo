import { encode } from "https://deno.land/std/strings/encode.ts";
import { decode } from "https://deno.land/std/strings/decode.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
const { connect, copy, EOF } = Deno
import { parserFactory } from "./parser.ts"


const getResponse = async (connection) => {

    const reader = new BufReader(connection);
    const first = await reader.peek(1);
    if (first === EOF) throw "unexpected EOF while parsing";

    const prefix = decode(first as Uint8Array);
    const parse = await parserFactory(prefix);

    const response = await parse(reader);
    return response;
}

const send = async (connection, command) => {

    const encoded = encode(`${command}\r\n`);
    await connection.write(encoded);

    const response = await getResponse(connection);
    return response;
}

const Redis = async (port: number) => {

    const connection = await connect({port, transport: "tcp"});

    return {
        set: (key: string, value: string) => send(connection, `set ${key} ${value}`),
        get: (key: string) => send(connection, `get ${key}`),
        increment: (key: string) => send(connection, `incr ${key}`),
    };
};


const redis = await Redis(6379);

await redis.set("value", "0");
const before = await redis.get("value");
await redis.increment("value");
const after = await redis.get("value");

console.log("before:", before, "after:", after);
