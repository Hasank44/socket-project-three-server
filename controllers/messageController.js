import Message from "../models/Message.js";
import Conversation from '../models/Conversation.js';
import mongoose from "mongoose";
import User from "../models/User.js";

export const getMessagesController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                message: "Invalid Conversation ID"
            });
        };
        const messages = await Message.find({ conversationId })
            .populate("sender", "fullName email")
            .sort({ createdAt: 1 });
        const formattedMessages = messages.map(message => ({
            conversationId: message.conversationId,
            user: {
                senderId : message.sender._id,
                fullname: message.sender.fullName,
                email: message.sender.email
            },
            message: message.text
        }));

        return res.status(200).json({
            message: "Message Retrieved Success",
            result: formattedMessages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error Occurred"
        });
    };
};

export const sendMessageController = async (req, res) => {
    try {
        const { _id: senderId } = req.user;
        const { conversationId } = req.params;
        const { text } = req.body;

        if (!mongoose.Types.ObjectId.isValid(senderId)) {
                return res.status(400).json({
                    message: "Invalid your ID"
            });
        };
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                return res.status(400).json({
                    message: "Invalid Conversation ID"
            });
        };
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                message: 'Message is Required or Invalid Message Type'
            });
        };
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                message: 'Conversation not found'
            });
        };
        const message = await Message.create({
            conversationId,
            sender: senderId,
            text
        });
        const receiverId = conversation.members.find(
            member => member._id.toString() !== senderId.toString()
        );
        return res.status(201).json({
            message: 'Message Send Success',
            result: {
                senderId: message?.sender,
                receiverId,
                text: message?.text,
                conversationId: message?.conversationId
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error Occurred'
        });
    };
};