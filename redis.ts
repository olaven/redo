import { BufReader, ReadLineResult } from "https://deno.land/std/io/bufio.ts"
const { connect, copy, EOF } = Deno

//string = +MESSAGE\r\n
const encode = (content: string) => {

    const encoder = new TextEncoder();
    const encoded = encoder.encode(content);
    return encoded;
}


const decode = (buffer: Uint8Array) => {

    const decoder = new TextDecoder("utf-8");
    const decoded = decoder.decode(buffer);
    return decoded;
}

const getLine = async (reader) => {

    const result = await reader.readLine()
    const line = (result as ReadLineResult).line
    return decode(line);
}

const parserFromPrefix = (prefix: string) => {

    if (prefix === "+") {

        return async (reader: BufReader) => {

            const line = await getLine(reader);
            return line;
        }
    }

    if (prefix === "$") {

        return async (reader: BufReader) => {

            reader.readLine();
            const relevant = (await reader.readLine()) as ReadLineResult;
            return decode(relevant.line);
        }
    }

    throw "A parser for this prefix is not implemented..";
}

const getResponse = async (connection) => {

    const reader = new BufReader(connection);
    const first = await reader.peek(1);
    if (first === EOF) throw "unexpected EOF while parsing";

    const prefix = decode(first as Uint8Array);
    const parse = await parserFromPrefix(prefix);

    const response = await parse(reader);
    return response;
}

const send = async (connection, command) => {

    console.log("sending command: ", command);
    const encoded = encode(`${command}\r\n`);
    await connection.write(encoded);

    const response = await getResponse(connection);
    return response; //TODO: refactort his function
}

const set = async (connection, key: string, value: string) => {

    const command = `set ${key} ${value}`;
    const response = await send(connection, command);
    return response;
}

const get = async (connection, key: string) => {

    const command = `get ${key}`;
    const response = await send(connection, command);
    return response;
}




const Redis = async (port: number) => {

    const connection = await connect({port, transport: "tcp"});

    return {
        set: (key: string, value: string) => set(connection, key, value),
        get: (key: string) => get(connection, key)
    };
};


const redis = await Redis(6379);


await redis.set("name", "guro");
const first = await redis.get("name");

console.log("first", first);
