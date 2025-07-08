let roomUsers = {};


export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('client connected:', socket.id);

        socket.on('joinRoom', ({roomId, user}) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);

            if (!roomUsers[roomId]) roomUsers[roomId] = [];
            const exists = roomUsers[roomId].some(u => u.name === user);
            if (!exists) roomUsers[roomId].push({ name: user, isHost: false });

            io.to(roomId).emit('roomData', { users: roomUsers[roomId] });
        });

        socket.on('chatMessage', ({ roomId, message }) => {
            io.to(roomId).emit('chatMessage', message);
        });

        socket.on('leaveroom', ({ roomId, user }) => {
            socket.leave(roomId);
            console.log(`🚪 ${user} left room ${roomId}`);
            if (roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(u => u.name !== user);
                io.to(roomId).emit('roomData', { users: roomUsers[roomId] });
            }
        });

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });
};