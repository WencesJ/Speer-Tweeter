// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

import { CustomRequest } from '@libs/interfaces/user';

// CHAT MODULES
import ChatsModel, { ChatDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<ChatDocument> & ChatDocument;

class ChatService extends ApiFeatures {
    /**
     * Creates chat controller
     * @param {Object} [chatModel = ChatModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected ChatModel = ChatsModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an Chat.
     * @async
     * @param {Object} details - Details required to create a Chat.
     * @returns {Object} Returns the created Chat
     * @throws Mongoose Error
     */

    async create(details: object) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const chat = await this.ChatModel.create({
            ...details,
        });

        return {
            value: {
                data: chat,
            },
        };
    };

    /**
     * Finds one Chat Data by it's id .
     * @async
     * @param {string} id/slug - unique id  of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let chatQuery = this.ChatModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            chatQuery = chatQuery.populate(populateOptions);
        // else chatQuery = chatQuery.lean();

        const chat = await chatQuery;

        if (!chat) {
            return {
                error: {
                    msg: 'Invalid Chat. Chat Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: chat,
            },
        };
    };
    /**
     * Finds one Chat Data by it's id.
     * @async
     * @param {string} id/slug - unique id  of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async getByRecipient(recipients: string[]) {
        let chat = await this.ChatModel.findByMembers(recipients);

        if (!chat) {
            chat = await this.ChatModel.create({ members: recipients });
        }

        return {
            value: {
                data: chat,
            },
        };
    };

    /**
     * Finds one All Data matching a specified query but returns all if object is empty.
     * @async
     * @param {Object} query - finds data based on queries.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async getAll(query: Request) {
        const chatsQuery = this.api(this.ChatModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const chats = await chatsQuery.query.lean();

        return {
            value: {
                data: chats,
            },
        };
    };

    /**
     * Deletes one Chat Data by it's id .
     * @async
     * @param {string} id/slug - unique id  of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        await this.ChatModel.deleteChatWithMsgs({ ...query });

        return {
            value: {
                data: {},
            },
        };
    };

    /**
     * Updates one Announcement Data by it's id.
     * @async
     * @param {string} id/slug - unique id  of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: Request) {
        const chat = await this.ChatModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!chat) {
            return {
                error: {
                    msg: 'Invalid Chat. Chat Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: chat,
            },
        };
    };
}

export default new ChatService();
