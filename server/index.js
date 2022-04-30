const { Server, socket } = require("socket.io");
const CHAT_ROOM_LIST = [
  { id: 1, name: "Eat Taro" },
  { id: 2, name: "Jak Ball" },
  { id: 3, name: "Srey Sart" },
  { id: 4, name: "KTV" },
  { id: 5, name: "Learn" },
];

const ChatRoomMessage = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
};

const io = new Server({
  /* options */
});

io.removeAllListeners();
var messageList = [];

io.on("connection", (socket) => {
  for (let i = 0; i <= CHAT_ROOM_LIST.length; i++) {
    const room = CHAT_ROOM_LIST[i] || {};
    if (room?.id) {
      socket.on(`join-room-${room.id}`, () => {
        console.log(`Someone join room ${room.id}`);
        // broadcast to joiner
        socket.emit(`join-room-${room.id}-success`, {
          color: "green",
          msg: `Join room ${room.name} successfully`,
          chatHistory: ChatRoomMessage[room.id],
        });

        // broadcast to member in room
        socket.broadcast.emit(`join-room-${room.id}-success`, {
          color: "green",
          msg: `${socket.id} has just join room`,
          chatHistory: ChatRoomMessage[room.id],
        });
      });

      socket.on(`leave-room-${room.id}`, () => {
        console.log(`${socket.id} leave room ${room.id}`);

        // broadcast to member in room
        socket.broadcast.emit(`leave-room-${room.id}-success`, {
          color: "red",
          msg: `${socket.id} has just leave room`,
        });
      });

      socket.on(`send-message-${room.id}`, (params) => {
        console.log(`Someone send message in room ${room.id}`, params);
        const msgObj = {
          sender: socket.id,
          msg: params.msg,
        };

        ChatRoomMessage[room.id].push(msgObj);

        // broadcast to member in room
        socket.broadcast.emit(`send-message-${room.id}-success`, msgObj);
      });
    }
  }
});

io.listen(3000);
