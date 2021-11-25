// importing the modules

import { Schema, model, Document } from 'mongoose';

import { hash, compare } from 'bcrypt';
import { removeProps } from '@libs/models/modelUtils';

export interface UserDocument extends Document {
    username: string;
    password: string;

    findByUsername: (username: string) => UserDocument;

    validPassword: (password: string) => Boolean;
}

const userSchema: Schema<UserDocument> = new Schema(
    {
        username: {
            type: String,
            required: [true, 'User Must Have A  Username!'],
            trim: true,
            lowercase: true,
            unique: [true, 'Username already exists!']
        },


        password: {
            type: String,
            required: true,
            trim: true,
        },

        createdAt: {
            type: Date,

            default: Date.now(),
        },
    },

    {
        toJSON: { 
            virtuals: true, 
            versionKey: false,
            //remove sensitive fields
            transform: removeProps(['password'])
        },

        toObject: { virtuals: true, versionKey: false },
    }
);

// indexing the doc for quick fetch

userSchema.index({ username: 1 });

// initiating the pre and post hooks
userSchema.pre<UserDocument>('save', async function (next) {
    this.password = await hash(this.password, 12);
    next();
});

// USER STATICS
userSchema.statics.findByUsername = async function (username: string) {
    return await this.findOne({ username });
};

// USER METHODS
userSchema.methods.validPassword = async function (password: string) {
    return await compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
