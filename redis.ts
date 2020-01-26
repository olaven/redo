const { connect, copy } = Deno

//string = +MESSAGE\r\n
const encode = (message: string) => {

    const testCommand = `set name guro\r\n`;

    const encoder = new TextEncoder();
    const encoded = encoder.encode(testCommand);
    return encoded;
}


const decode = (buffer: Uint8Array) => {

    const decoder = new TextDecoder("utf-8");
    const decoded = decoder.decode(buffer);
    return decoded;
}


const receiveStuff = async (connection) => {

    const buffer = new Uint8Array(100);
    const content = await connection.read(buffer);

    const decoded = decode(buffer);


    console.log("receiveStuff: ", content);
}

const sendCommand = async (connection, command) => {

    const encoded = encode(command);
    const something = await connection.write(encoded);

    console.log("sender: ", something);
}



const redisServer = async () => {

    const connection = await connect({port: 6379, transport: "tcp"});

    receiveStuff(connection);
    sendCommand(connection, "set name guro");

}

redisServer();
