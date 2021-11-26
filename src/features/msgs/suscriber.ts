/**
 *
 * @description subScribes for tweet Feature
 */
import { Logger } from 'winston';
import compEmitter, { registerEvents } from '@libs/suscribers';

declare let _logger: Logger;

const tweetEvents = (eventEmitter: typeof compEmitter) => {
    eventEmitter.on('New Tweet', (tweet: object) => {
        _logger.info(`✅✅✅ ➡ New Tweet has been created!\nTweet = ${tweet}`);
    });

    eventEmitter.on('Updated Tweet', (tweet: object) => {
        _logger.info(`✅✅✅ ➡ Tweet has been updated!\nTweet = ${tweet}`);
    });

    eventEmitter.on('Deleted Tweet', (tweet: object) => {
        _logger.info(`✅✅✅ ➡ Tweet has been updated!\nTweet = ${tweet}`);
    });

    return eventEmitter;
};

registerEvents(tweetEvents);

export default tweetEvents;
