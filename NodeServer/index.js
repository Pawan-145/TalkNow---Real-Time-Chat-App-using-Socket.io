const io = require('socket.io')(8000, {
    cors: {
        origin: "*",
    }
});

const users = {}; // 🔹 Renamed to 'users' for clarity

io.on('connection', socket => {
    // When a new user joins
    socket.on('new-user-joined', name => {
        console.log("New User:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // Notify others
    });

    // When a user sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects
    socket.on('disconnect', message => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id]; // Remove from users list
        }
    });
});
