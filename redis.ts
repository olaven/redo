const { connect, copy } = Deno

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

    const encoded = encode(command);
    const response = await connection.write(encoded);

    console.log("sender: ", response);
}

const set = (connection, key: string, value: string) => {

    const command = `set ${key} ${value}\r\n`;
    send(connection, command);
}

const get = (connection, key: string) => {

    //TODO: implement
    throw "get is not implemented";
}




const Redis = async (port: number) => {

    const connection = await connect({port, transport: "tcp"});

    return {
        set: (key: string, value: string) => set(connection, key, value),
        get: (key: string) => get(connection, key)
    };
};


const redis = await Redis(6379);
redis.set("name", "elon");
