// NODE MODULES

// TWEET MODULES
import TweetService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<TweetService>} - Instance of TweetService class
 */
const tweetServiceInstance = new TweetService();

// TWEET AUTHENTICATION CONTROLLERS
/**
 * Tweet Controller class
 * @class
 */

class TweetController {
    /**
     * @description Creates tweet controller
     * @param {Object} [tweetService = tweetServiceInstance] - same as tweetServiceInstance Object
     *
     */

    constructor(public TweetService = tweetServiceInstance) {
        /**
         * @type {Object}
         * @borrows tweetService
         */
    }

    /**
     * Creates a Tweet
     * @async
     * @route {POST} /tweet/
     * @access protected
     */
    createTweet: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a Tweet.
             */

            const tweetDetails = { ...req.body, author: req.user.id };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: tweet = {} } = {} } =
                await this.TweetService.create(tweetDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                tweet,
            });
        }
    );

    /**
     * Gets one Tweet Data
     * @async
     * @route {GET} /tweet/:slug or :/id
     * @access public
     */
    getTweet: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            console.log(queryFields);

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or tweetname to Search
             */

            const { error, value: { data: tweet = {} } = {} } =
                await this.TweetService.get({ _id: queryFields._id });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                tweet,
            });
        }
    );

    /**
     * Gets All Tweet Datas
     * @async
     * @route {GET} /tweets/
     * @access public
     */
    getAllTweets = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Tweets Collection
         */
        const queryFields: any = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: tweets = {} } = {} } =
            await this.TweetService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            tweets,
        });
    });

    deleteTweet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion deletes a tweet
             */

            await this.TweetService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * @route {GET} - /tweets/:id or /:slug
     */

    updateTweet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Updates a tweet
             */

            const { error, value: { data: tweet = {} } = {} } =
                await this.TweetService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                tweet,
            });
        }
    );
}

const tweetCntrl = new TweetController();

export default tweetCntrl;
