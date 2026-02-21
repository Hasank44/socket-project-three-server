import { Schema, model} from 'mongoose';

const conversationSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
}, { timestamps: true });

const Conversation = model('Conversation', conversationSchema);

export default Conversation;
