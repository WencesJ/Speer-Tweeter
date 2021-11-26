// NODE MODULES

// MSG MODULES
import msgService from './service';

import { Service as userService } from '@features/users';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

// MSG AUTHENTICATION CONTROLLERS
/**
 * Msg Controller class
 * @class
 */

class MsgController {
    /**
     * @description Creates msg controller
     * @param {Object} [msgService = msgServiceInstance] - same as msgServiceInstance Object
     *
     */

    constructor(public MsgService = msgService, public UserService = userService) {
        /**
         * @type {Object}
         * @borrows msgService
         */
    }

    /**
     * Creates a Msg
     * @async
     * @route {POST} /:chat/msg
     * @access protected
     */
    createMsg: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields required for creating a Msg.
             */

             if (req.user.id === req.body.recipient) {
                return next(new AppError('Error! You cannot chat with yourself.', 401));
            }

             const { error } = await this.UserService.get({ _id: req.body.recipient });
            
             if (error) {
                 const msg = error.msg.replace('User', 'Recipient');
     
                 return next(new AppError(msg, error.code));
             }

            const msgDetails = { ...req.body, author: req.user.id, chat: req.params.chat };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: msg = {} } = {} } =
                await this.MsgService.create(msgDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                msg,
            });
        }
    );

     /**
     * Gets All Msg Datas By Chat
     * @async
     * @route {GET} /:chat/chat
     * @access protected
     */
    getMsgsByChat: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Use Either a mongodbUniqueId Or msgname to Search
             */

            const {value: { data: msgs = {} } = {} } =
                await this.MsgService.getAllByChat(queryFields.chat);

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                msgs,
            });
        }
    );

   /**
     * Creates a Msg
     * @async
     * @route {DELETE} /:chat/msg
     * @access protected
    */
    deleteMsg = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a msg
             */

            await this.MsgService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );
}

const msgCntrl = new MsgController();

export default msgCntrl;
