// NODE MODULES

// TWEET MODULES
import tweetService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

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

    constructor(public TweetService = tweetService) {
        /**
         * @type {Object}
         * @borrows tweetService
         */
    }

    /**
     * Creates a Tweet
     * @async
     * @route {POST} /
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
     * @route {GET} /:id/tweet
     * @access protected
     */
    getTweet: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Use Either a mongodbUniqueId Or tweetname to Search
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
     * Gets one Tweet Data
     * @async
     * @route {GET} /
     * @access protected
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

    /**
     * Delete one Tweet Data
     * @async
     * @route {DELETE} /:id/tweet
     * @access protected
     */
    deleteTweet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a tweet
             */

            await this.TweetService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * Updates one Tweet Data
     * @async
     * @route {UPDATE} /:id/tweet
     * @access protected
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
             * @description Updates a tweet
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

    /**
     * Like a Tweet Data
     * @async
     * @route {POST} /:id/tweet
     * @access protected
     */
     likeTweet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a tweet
            */

            const { error, value: { data: tweet = {} } = {} } = await this.TweetService.likeAndUnlikeTweet(req.params._id, 'like');

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                tweet
            });
        }
    );

    /**
     * unlike a Tweet Data
     * @async
     * @route {POST} /:id/tweet
     * @access protected
     */
     unlikeTweet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
             /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a tweet
            */

            const { error, value: { data: tweet = {} } = {} } = await this.TweetService.likeAndUnlikeTweet(req.params._id, 'unlike');

            if (error) {
                return next(new AppError(error.msg, error.code));
            }
            
            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                tweet
            });
        }
    );
}

const tweetCntrl = new TweetController();

export default tweetCntrl;
