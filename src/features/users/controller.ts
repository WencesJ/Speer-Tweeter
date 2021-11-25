// NODE MODULES

// USER MODULES
import UserService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

import Authentication from '../auth/auth';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<UserService>} - Instance of UserService class
 */
const userServiceInstance = new UserService();

// USER AUTHENTICATION CONTROLLERS
/**
 * User Controller class
 * @class
 */

class UserController extends Authentication {
    /**
     * @description Creates user controller
     * @param {Object} [userService = userServiceInstance] - same as userServiceInstance Object
     *
     */

    constructor(public UserService = userServiceInstance) {
        super(UserService);
        /**
         * @type {Object}
         * @borrows userService
         */
    }

    /**
     * Creates a User
     * @async
     * @route {POST} /user/
     * @access protected
     */
    createUser: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a User.
             */
            const userDetails = { ...req.body };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: user = {} } = {} } =
                await this.UserService.create(userDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets one User Data
     * @async
     * @route {GET} /user/:slug or :/id
     * @access public
     */
    getUser: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or username to Search
             */

            const { error, value: { data: user = {} } = {} } =
                await this.UserService.get({ username: queryFields.username });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets All User Datas
     * @async
     * @route {GET} /users/
     * @access public
     */
    getAllUsers = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Users Collection
         */
        const queryFields: any = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: users = {} } = {} } =
            await this.UserService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            users,
        });
    });

    deleteUser = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion deletes a user
             */

            await this.UserService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * @route {GET} - /users/:id or /:slug
     */

    updateUser = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Updates a user
             */

            const { error, value: { data: user = {} } = {} } =
                await this.UserService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );
}

const userCntrl = new UserController();

export default userCntrl;
