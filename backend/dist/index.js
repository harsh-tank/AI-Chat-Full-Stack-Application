"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const imagekit_1 = __importDefault(require("imagekit"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 3000;
const userChats_1 = __importDefault(require("./models/userChats"));
const chat_1 = __importDefault(require("./models/chat"));
const express_2 = require("@clerk/express");
const app = (0, express_1.default)();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const corsOptions = {
    origin: process.env.CLIENT_URL, // Allowed origin
    credentials: true, // Allow credentials
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const connect = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log(err);
    }
};
const imagekit = new imagekit_1.default({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});
//app.options('/api/*', cors(corsOptions));
app.get("/api/testing/only", (req, res) => {
    return res.send({ message: "Testing Successful" });
});
app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});
app.post("/api/chats", (0, express_2.requireAuth)(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;
    try {
        const newChat = new chat_1.default({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }],
        });
        const savedChat = await newChat.save();
        // CHECK IF THE USERCHATS EXISTS
        const userChats = await userChats_1.default.find({ userId: userId });
        // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
        if (!userChats.length) {
            const newUserChats = new userChats_1.default({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                ],
            });
            await newUserChats.save();
        }
        else {
            // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
            await userChats_1.default.updateOne({ userId: userId }, {
                $push: {
                    chats: {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                },
            });
            res.status(201).send(newChat._id);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat!");
    }
});
app.get("/api/userchats", (0, express_2.requireAuth)(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const userChats = await userChats_1.default.find({ userId });
        res.status(200).send(userChats[0].chats);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});
app.get("/api/chats/:id", (0, express_2.requireAuth)(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const chat = await chat_1.default.findOne({ _id: req.params.id, userId });
        res.status(200).send(chat);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
});
app.put("/api/chats/:id", (0, express_2.requireAuth)(), async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;
    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];
    try {
        const updatedChat = await chat_1.default.updateOne({ _id: req.params.id, userId }, {
            $push: {
                history: {
                    $each: newItems,
                },
            },
        });
        res.status(200).send(updatedChat);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
    }
});
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
};
app.use(errorHandler);
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });
app.listen(port, () => {
    connect();
    console.log(`Server running on ${port} started`);
});
