const net = require('net');
const { argv } = require('node:process');

let connectedUsers = 0;
let users = [];

const server = net
.createServer((client) => {
    console.log('Client connected');
    client.write("Welcome to the chat room!\n");
    connectedUsers += 1;
    client.userid = connectedUsers;
    client.write(`USERID: ${connectedUsers}\n`)
    users.push(client)
    
    client.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`User ${client.userid} says: ${message}`);
        
        if(message.startsWith('/dm')){
            let dmu = message.charAt(3); 
            let targetUserId = parseInt(dmu); 
            
            
            let targetUser = users.find(user => user.userid === targetUserId);
            if(targetUser){
                targetUser.write(`User ${client.userid}: ${message.substring(4)}\n`);
            } else {
                client.write(`User ${targetUserId} not found\n`);
            }
        }
        else{
            users.forEach((c) => {
                if(c.userid !== client.userid){
                    c.write(`User ${client.userid}: ${message}\n`);
                }
            });
        }
    });
    
    client.on('error', (err) => {
        console.log('Client error:', err);
    });

    client.on('end', () => {
        console.log(`client ${client.userid} disconnected`)
        users.pop(client)
    })
})
.listen(4000, () => {
    console.log("Listening on port 4000");
})
.on('error', (err) => {
    console.log('Server error:', err);
});

