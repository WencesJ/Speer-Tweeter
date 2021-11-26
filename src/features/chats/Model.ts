// importing the modules

import { removeProps } from '@libs/models/modelUtils';
import { Schema, model, Document, connection } from 'mongoose';

export interface ChatDocument extends Document {
    members: string[];

    findByMembers: (members: string[]) => ChatDocument;
    findAMember: (member: string) => ChatDocument;
    deleteChatWithMsgs: (query: Record<string, unknown>) => void;
}

const chatSchema: Schema<ChatDocument> = new Schema(
    {
        members: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: 'User'
            }],
            required: [true, 'Chat must have members!']
        },
    },

    {
        toJSON: { 
            virtuals: true, 
            versionKey: false,
            transform: removeProps([])
        },

        toObject: { virtuals: true, versionKey: false },
        
        timestamps: true,
    }
);

// initiating the pre and post hooks

// CHAT STATICS
chatSchema.statics.findByMembers = async function (members: string[]) {
    return await this.findOne({ members: { $all: [ ...members ] } });
};
chatSchema.statics.findAMember = async function (member: string) {
    return await this.find({ members: member });
};
chatSchema.statics.deleteChatWithMsgs = async function (query: Record<string, unknown>) {
    const chat = await this.findOneAndDelete(query);

    if (!chat) {
        return;
    }

    const session = await connection.startSession();
    try {
        session.startTransaction();                    
        
        await model('Msg').deleteMany({ chat: chat.id });

        await this.findByIdAndDelete(chat.id);

        await session.commitTransaction();
    } catch (error) {

        await session.abortTransaction();
    }
    session.endSession();
};

// CHAT METHODS

const Chat = model('Chat', chatSchema);

export default Chat;
