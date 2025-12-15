const net = require('net');
const fs = require('fs');
const readline = require('readline');


userid = null;

const client = net.createConnection(4000, () => {
    console.log("connected");
});

client.on('error', (error) => {
    console.log(error);
});

client.on("data", (data) => {
    const message = data.toString();
    console.log(message);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false  
});


rl.on('line', (line) => {
    client.write(line);
    fs.appendFileSync('chat.log', `${userid}: ${line}\n`);
});