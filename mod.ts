import {
    encode, decode,
    BufReader, ReadLineResult
} from "./deps.ts";

const { connect, copy, EOF } = Deno
import { parserFactory, getPrefix } from "./parser.ts"


const getResponse = async (connection) => {

    const reader = new BufReader(connection);
    const prefix = await getPrefix(reader);
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

export const Redis = async (port: number) => {

    const connection = await connect({port, transport: "tcp"});

    return {
        set: (key: string, value: string) => send(connection, `SET ${key} ${value}`),
        get: (key: string) => send(connection, `GET ${key}`),
        increment: (key: string) => send(connection, `INCR ${key}`),
        delete: (key: string) => send(connection, `DEL ${key}`),
        array: (key: string) => ({
            get: (start: number = 0, end: number = -1) => send(connection, `LRANGE ${key} ${start} ${end}`),
            append: (value) => send(connection, `RPUSH ${key} ${value}`)
        })
    }
}
