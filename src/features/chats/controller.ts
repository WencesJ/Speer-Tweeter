// NODE MODULES

// CHAT MODULES
import chatService from './service';

import { Service as userService } from '@features/users';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

// CHAT AUTHENTICATION CONTROLLERS
/**
 * Chat Controller class
 * @class
 */

class ChatController {
    /**
     * @description Creates chat controller
     * @param {Object} [chatService = chatServiceInstance] - same as chatServiceInstance Object
     *
     */

    constructor(public ChatService = chatService, public UserService = userService) {
        /**
         * @type {Object}
         * @borrows chatService
         */
    }

    /**
     * Gets All Chat Datas
     * @async
     * @route {GET} /
     * @access public
     */
    getChatByRecipient = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        /**
             * @type {Object} - An Object of fields required for creating a Chat.
             */

        if (req.user.id === req.params.recipient) {
            return next(new AppError('Error! You cannot chat with yourself.', 401));
        }

        const { error } = await this.UserService.get({ _id: req.params.recipient });

        if (error) {
            const msg = error.msg.replace('User', 'Recipient');

            return next(new AppError(msg, error.code));
        }

         const chatDetails = { members: [req.user.id, req.params.recipient] };

         /**
          * @type {Object} - Holds the created data object.
          */
         const { value: { data: chat = {} } = {} } =
             await this.ChatService.getByRecipient(chatDetails.members);

         // Returns a json response
         res.status(STATUS.CREATED).json({
             message: MSG.SUCCESS,
             chat,
         });
     });

    /**
     * Gets All Chat Datas
     * @async
     * @route {GET} /
     * @access public
     */
    getAllChats = catchAsync(async (req: CustomRequest, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Chats Collection
         */
        const queryFields: any = { members: req.user.id, ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: chats = {} } = {} } =
            await this.ChatService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            chats,
        });
    });

    deleteChat = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a chat
             */

            await this.ChatService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );
}

const chatCntrl = new ChatController();

export default chatCntrl;
