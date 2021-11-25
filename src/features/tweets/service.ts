// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// TWEET MODULES
import TweetsModel, { TweetDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<TweetDocument> & TweetDocument;

class TweetService extends ApiFeatures {
    /**
     * Creates tweet controller
     * @param {Object} [tweetModel = TweetModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected TweetModel = TweetsModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an Tweet.
     * @async
     * @param {Object} details - Details required to create a Tweet.
     * @returns {Object} Returns the created Tweet
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const tweet = await this.TweetModel.create({
            ...details,
        });

        return {
            value: {
                data: tweet,
            },
        };
    };

    /**
     * Finds one Tweet Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let tweetQuery = this.TweetModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            tweetQuery = tweetQuery.populate(populateOptions);
        // else tweetQuery = tweetQuery.lean();

        const tweet = await tweetQuery;

        if (!tweet) {
            return {
                error: {
                    msg: 'Invalid Tweet. Tweet Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: tweet,
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
        const tweetsQuery = this.api(this.TweetModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tweets = await tweetsQuery.query.lean();

        return {
            value: {
                data: tweets,
            },
        };
    };

    /**
     * Deletes one Tweet Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const tweet = await this.TweetModel.findOneAndDelete({ ...query });

        return {
            value: {
                data: tweet,
            },
        };
    };

    /**
     * Updates one Announcement Data by it's id.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: Request) {
        const tweet = await this.TweetModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!tweet) {
            return {
                error: {
                    msg: 'Invalid Tweet. Tweet Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: tweet,
            },
        };
    };
}

export default TweetService;
