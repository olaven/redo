const { connect, copy } = Deno

const encode = (message: string) => {

    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);
    return encoded;
}

const decode = (buffer: Uint8Array) => {

    const decoder = new TextDecoder();
    const decoded = decoder.decode(buffer);
    return decoded;
}


const receiver = async (connection) => {

    const buffer = new Uint8Array(100);
    const content = await connection.read(buffer);
    const decoded = decode(buffer);


    console.log("receiver: ", content);
}

const sendCommand = async (connection, command) => {

    const encoded = encode(command);
    const something = await connection.write(encoded);

    console.log("sender: ", something);
}



const redisServer = async () => {

    const connection = await connect({port: 6379, transport: "tcp"});

    receiver(connection);
    sendCommand(connection, "set name guro");

}

redisServer();
