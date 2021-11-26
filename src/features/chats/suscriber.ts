/**
 *
 * @description subScribes for chat Feature
 */
import { Logger } from 'winston';
import compEmitter, { registerEvents } from '@libs/suscribers';

declare let _logger: Logger;

const chatEvents = (eventEmitter: typeof compEmitter) => {
    eventEmitter.on('New Chat', (chat: object) => {
        _logger.info(`✅✅✅ ➡ New Chat has been created!\nChat = ${chat}`);
    });

    eventEmitter.on('Updated Chat', (chat: object) => {
        _logger.info(`✅✅✅ ➡ Chat has been updated!\nChat = ${chat}`);
    });

    eventEmitter.on('Deleted Chat', (chat: object) => {
        _logger.info(`✅✅✅ ➡ Chat has been updated!\nChat = ${chat}`);
    });

    return eventEmitter;
};

registerEvents(chatEvents);

export default chatEvents;
