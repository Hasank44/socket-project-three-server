import { Server } from "socket.io";

let io = null;
let users = [];
export const initSocket = server => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONT_URL,
            credentials: true,
        },
    });
    io.on("connection", socket => {
        console.log(socket.id)
        socket.on('addUser', userId => {
            const userIsExist = users.find(user => user.userId === userId);
            if (!userIsExist) {
                const user = { userId, socketId: socket.id };
                users.push(user);
                io.emit('getUsers', users);
            };
        });
        socket.on('sendMessage', (data) => {
            const { conversationId, senderId, receiverId, text } = data;

            const sender = users.find(
                user => user.userId.toString() === senderId.toString()
            );
            const receiver = users.find(
                user => user.userId.toString() === receiverId.toString()
            );
            const message = {
                conversationId,
                receiverId,
                message: text,
                user: {
                    senderId
                }
            };
            if (sender) {
                socket.emit("receiveMessage", message);
            };
            if (receiver) {
                io.to(receiver.socketId).emit('receiveMessage', message);
                console.log('receiver', message)
            };
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
            users = users.filter(user => user.socketId !== socket.id);
            io.emit("getUsers", users);
        });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    };
    return io;
};