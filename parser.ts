import {
    encode, decode,
    BufReader, ReadLineResult
} from "./deps.ts";
const { EOF } = Deno

const readCurrentLine = async (reader: BufReader) => {

    const result = (await reader.readLine()) as ReadLineResult;
    const encoded = result.line;

    const line = decode(encoded)
    return line;
}


const stringParser = async (reader: BufReader) => {

    return readCurrentLine(reader);
}


const bulkStringParser = async (reader: BufReader) => {

    const bytesIndicator = await readCurrentLine(reader);
    if (bytesIndicator === "$-1") return null;

    return readCurrentLine(reader);
}

const errorParser = async (reader: BufReader) => {

    return readCurrentLine(reader);
}

const integerParser = async (reader: BufReader) => {

    const asString = await readCurrentLine(reader);
    const integer = parseInt(asString.substr(1));
    return integer;
}

const arrayParser = async (reader: BufReader) => {

    const firstLine = await readCurrentLine(reader);
    const length = parseInt(firstLine.substr(1));

    const array = [];
    for (let i = 0; i < length; i++) {

        // NOTE: each element has to be parsed, and may be of different types
        const prefix = await getPrefix(reader);
        const parsed = await parserFactory(prefix)(reader);
        array.push(parsed);
    }

    return array;
}

export const parserFactory = (prefix: string) => {

    const parsers = {
        "+": stringParser,
        "-": errorParser,
        "$": bulkStringParser,
        ":": integerParser,
        "*": arrayParser
    }

    const parser = parsers[prefix];
    if (!parser) throw "A parser for this prefis is not implemented";

    return parser;
}

export const getPrefix = async (reader: BufReader) => {

    const first = await reader.peek(1);
    if (first === EOF) throw "unexpected EOF while parsing";

    const prefix = decode(first as Uint8Array);
    return prefix
}
