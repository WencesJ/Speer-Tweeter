// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// MSG MODULES
import MsgsModel, { MsgDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<MsgDocument> & MsgDocument;

class MsgService extends ApiFeatures {
    /**
     * Creates msg controller
     * @param {Object} [msgModel = MsgModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected MsgModel = MsgsModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an Msg.
     * @async
     * @param {Object} details - Details required to create a Msg.
     * @returns {Object} Returns the created Msg
     * @access protected
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const msg = await this.MsgModel.create({
            ...details,
        });

        return {
            value: {
                data: msg,
            },
        };
    };

    /**
     * Finds one All Data matching a specified query but returns all if object is empty.
     * @async
     * @param {Object} query - finds data based on queries.
     * @returns {Object} Returns the found requested data
     * @access protected
     * @throws Mongoose Error
     */
    async getAll(query: Request) {
        const msgsQuery = this.api(this.MsgModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const msgs = await msgsQuery.query.lean();

        return {
            value: {
                data: msgs,
            },
        };
    };

    /**
     * Finds one All Data matching a specified query but returns all if object is empty.
     * @async
     * @param {Object} query - finds data based on queries.
     * @returns {Object} Returns the found requested data
     * @access protected
     * @throws Mongoose Error
     */
    async getAllByChat(chat: string) {
        const msgs = await this.MsgModel.findByChat(chat);

        return {
            value: {
                data: msgs,
            },
        };
    };

    /**
     * Deletes one Msg Data by it's id.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     * @access protected
     */
    async delete(query: object) {
        const msg = await this.MsgModel.findOneAndDelete({ ...query });

        return {
            value: {
                data: msg,
            },
        };
    };
}

export default new MsgService();
