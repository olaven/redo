import { BufReader, ReadLineResult } from "https://deno.land/std/io/bufio.ts"

//string = +MESSAGE\r\n
export const encode = (content: string) => {

    const encoder = new TextEncoder();
    const encoded = encoder.encode(content);
    return encoded;
}

//TODO: are equivalent functions in standard library?
export const decode = (buffer: Uint8Array) => {

    const decoder = new TextDecoder("utf-8");
    const decoded = decoder.decode(buffer);
    return decoded;
}


const readCurrentLine = async (reader: BufReader) => {

    const result = (await reader.readLine()) as ReadLineResult;
    const encoded = result.line;

    const line = decode(encoded);
    return line;
}


const stringParser = async (reader: BufReader) => {

    return readCurrentLine(reader);
}


const bulkStringParser = async (reader: BufReader) => {

    await reader.readLine();
    return readCurrentLine(reader);
}

const errorParser = async (reader: BufReader) => {

    return readCurrentLine(reader);
}

const integerParser = async (reader: BufReader) => {

    const asString = await readCurrentLine(reader);
    const integer = parseInt(asString);
    return integer;
}

export const parserFactory = (prefix: string) => {

    const parsers = {
        "+": stringParser,
        "-": errorParser,
        "$": bulkStringParser,
        ":": integerParser,
    }

    const parser = parsers[prefix];
    if (!parser) throw "A parser for this prefis is not implemented";

    return parser;
}
