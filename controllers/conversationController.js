import Conversation from "../models/Conversation.js";
import mongoose from "mongoose";
import User from '../models/User.js';

export const getConversationController = async (req, res) => {
    try {
        const { _id: senderId } = req.user;
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({
                message: "Invalid your ID"
            });
        };
        const user = await User.findById(senderId);
        if (!user || user.isLoggedIn === false) {
            return res.status(400).json({
                message: 'User not found or logged out'
            });
        };
        const conversations = await Conversation.find({ members: { $in: [senderId] } })
            .populate("members", "fullName email");
        const conversationUserData = conversations.map(conversation => {
            const receiverId = conversation.members.find(
                member => member._id.toString() !== senderId.toString()
            );
            return {
                conversationId: conversation._id,
                receiver: receiverId
            };
        });
        return res.status(200).json({
            message: 'Conversation Retrieved Success',
            result: conversationUserData
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error Occurred'
        });
    };
};

export const createConversation = async (req, res) => {
    try {
        const { _id } = req.user;
        const senderId = _id;
        const { receiverId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({
                message: "Invalid your ID"
            });
        };
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                message: "Invalid receiver ID"
            });
        };
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                message: "You cannot chat with yourself"
            });
        };
        const reserverUser = await User.findById(receiverId);
        if (!reserverUser) {
            return res.status(404).json({
                message: 'Conversation user not found'
            });
        };
        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        }).populate("lastMessage");
        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiverId],
            });
        };
        return res.status(200).json({
            message: 'Conversation created success',
            result: conversation
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error Occurred'
        });
    };
};