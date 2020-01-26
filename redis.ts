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


const send = async (connection, command) => {

    const encoded = encode(`${command}\r\n`);
    await connection.write(encoded);

    const reader = new BufReader(connection);
    const firstByte = await reader.peek(1);

    if (firstByte == EOF) throw "EOF as response";
    const line = ((await reader.readLine()) as ReadLineResult).line
    const response = decode(line);

    console.log("with command: ", command);
    console.log("returning response: ", response);

    return response; //TODO: refactort his function
}

const set = async (connection, key: string, value: string) => {

    const command = `set ${key} ${value}`;
    send(connection, command);
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
const name = await redis.get("name");
console.log(name);
