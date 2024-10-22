const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const port = 3500;
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
    },
});


const activeUsers = new Map();
const userMessages = new Map();

io.on("connection", (socket) => {
    console.log(`Connection established: ${socket.id}`);

    socket.on('userInfo', (userBody) => {
        activeUsers.set(socket.id, { userName: userBody.userName, profilePicUrl: userBody.profilePicUrl, socketId: socket.id });
        io.emit('activeUsers', Array.from(activeUsers.values()));
    });

    socket.on('disconnect', () => {
        const disconnectedUser = activeUsers.get(socket.id);

        if (disconnectedUser) {
            console.log(`${disconnectedUser.userName} disconnected`);
            activeUsers.delete(socket.id);
            io.emit('disconnected', socket.id);
        }
    });

    socket.on('messageSending', (body) => {
        const senderId = socket.id;
        const receiverId = body.receiver;

        if (!userMessages.has(senderId)) {
            userMessages.set(senderId, new Map());
        }
        if (!userMessages.has(receiverId)) {
            userMessages.set(receiverId, new Map());
        }

        const senderMessages = userMessages.get(senderId);
        const receiverMessages = userMessages.get(receiverId);

        if (!senderMessages.has(receiverId)) {
            senderMessages.set(receiverId, []);
        }
        if (!receiverMessages.has(senderId)) {
            receiverMessages.set(senderId, []);
        }

        const newMessage = { sender: senderId, message: body.inputMessage };
        senderMessages.get(receiverId).push(newMessage);
        receiverMessages.get(senderId).push(newMessage);

        io.to(receiverId).emit('receivingMessage', newMessage);
    });
socket.on('fetchMessages', (body) => {
  const senderId = socket.id;
  const receiverId = body.receiver;

  if (userMessages.has(senderId) && userMessages.get(senderId).has(receiverId)) {
      const messages = userMessages.get(senderId).get(receiverId);
      io.to(senderId).emit('fetchedMessages', { receiver: receiverId, messages });
  }
});
});

const users = [
  {
    id: "1",
    user_name: "user1",
    user_email_id: "user1@example.com",
    password: "password1",
    profile_url: "/profiles/user1.png",
  },
  {
    id: "2",
    user_name: "user2",
    user_email_id: "user2@example.com",
    password: "password2",
    profile_url: "/profiles/user2.png",
  },
  {
    id: "3",
    user_name: "user3",
    user_email_id: "user3@example.com",
    password: "password3",
    profile_url: "/profiles/user3.png",
  },
];

const postsList = [
  {
    id: "1",
    content: "Exploring new technologies and pushing boundaries. #TechInnovation",
    creator: "user1",
    creatorProfile: "/profiles/user1.png",
  },
  {
    id: "2",
    content: "Just finished reading an amazing book! Highly recommend 'The Silent Stars' by Jane Doe. 📚 #BookRecommendation",
    creator: "user2",
    creatorProfile: "/profiles/user2.png",
  },
  {
    id: "3",
    content: "Cooking up a storm in the kitchen tonight! 🍳 #ChefLife #HomeCooking",
    creator: "user3",
    creatorProfile: "/profiles/user3.png",
  },
  {
    id: "4",
    content: "Dreaming of tropical beaches and crystal-clear waters. 🏝️ #TravelGoals",
    creator: "user1",
    creatorProfile: "/profiles/user1.png",
  },
  {
    id: "5",
    content: "Coding late into the night, chasing those lines of code. 💻 #DeveloperLife",
    creator: "user2",
    creatorProfile: "/profiles/user2.png",
  },
  {
    id: "6",
    content: "Just adopted a furry friend! Meet Luna, my new companion. 🐾 #PetLove",
    creator: "user3",
    creatorProfile: "/profiles/user3.png",
  },
  {
    id: "7",
    content: "Reflecting on the beauty of nature. Sometimes, you just need to pause and appreciate. 🌿 #NatureLover",
    creator: "user1",
    creatorProfile: "/profiles/user1.png",
  },
  {
    id: "8",
    content: "In the studio, working on some new beats. Exciting things coming soon! 🎶 #MusicProducer",
    creator: "user2",
    creatorProfile: "/profiles/user2.png",
  },
  {
    id: "9",
    content: "Morning yoga routine to start the day with positivity and energy. 🧘‍♂️ #WellnessWednesday",
    creator: "user3",
    creatorProfile: "/profiles/user3.png",
  },
  {
    id: "10",
    content: "Experimenting with watercolor painting today. Art is a wonderful escape. 🎨 #ArtisticJourney",
    creator: "user1",
    creatorProfile: "/profiles/user1.png",
  },
  {
    id: "11",
    content: "Enjoying a cup of coffee and a good book on a rainy afternoon. ☕📖 #CozyDay",
    creator: "user2",
    creatorProfile: "/profiles/user2.png",
  },
  {
    id: "12",
    content: "Completed a challenging hike today. The view from the summit was breathtaking. ⛰️ #HikingAdventure",
    creator: "user3",
    creatorProfile: "/profiles/user3.png",
  },
  {
    id: "13",
    content: "Building and launching rockets in my backyard. 🚀 #RocketScience",
    creator: "user1",
    creatorProfile: "/profiles/user1.png",
  },
  {
    id: "14",
    content: "Excited to share snippets from my upcoming novel. Stay tuned for the release! 📖✨ #WritingCommunity",
    creator: "user2",
    creatorProfile: "/profiles/user2.png",
  },
  {
    id: "15",
    content: "Spontaneous road trip with friends. Adventures await! 🚗🌄 #RoadTrip",
    creator: "user3",
    creatorProfile: "/profiles/user3.png",
  },
];


app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.static(__dirname)); // Serve static files

app.get("/api/user/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});


const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  const user = users.find(
    (u) => u.user_name === username && u.password === password
  );

  if (user) {
  
    console.log(user);
    res.send({ userDetails: user, message: "User is found successfully!" });

  } else {
    console.log("Authentication failed for:", username);
    res.status(401).json({ error: "Authentication failed" });
  }
};

app.post("/api/user/login", authenticateUser, (req, res) => {
  //calling middleware
});


app.get("/index", (req, res) => {
  res.redirect("/api/user/login");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/posts", (req, res) => {
  const { content, creator, creatorProfile } = req.body;

  if (!content || !creator || !creatorProfile) {
    return res
      .status(400)
      .json({ error: "Content and creator are required fields." });
  }

  const newPost = {
    id: postsList.length + 1,
    content,
    creator,
    creatorProfile,
  };

  postsList.unshift(newPost);
  console.log(newPost);
  res.status(201).json(newPost);
});

app.get('/api/post/:id', (req, res) => {
  const postId = req.params.id;

  const post = postsList.find(post => post.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.get('/api/posts', (req, res) => {
    const { pageNumber, pageSize } = req.query;
    const start = (pageNumber - 1) * pageSize;
    const end = start + Number(pageSize);
    const paginatedPosts = postsList.slice(start, end);
    res.json(paginatedPosts);
  });
  
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
