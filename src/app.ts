import fs from 'fs'
import { constructLogEventHandler } from './gameLogListener';

console.log('Server is up');


// TODO: find a not garbage way to do this
fs.promises.readdir('../../../Library/Application Support/com.wizards.mtga/Logs/Logs').then(files => {
    const mostRecentLog = files.filter(fileName => fileName.includes('UTC_Log')).sort().pop();
    if (mostRecentLog) {
        console.log(`Reading from [${mostRecentLog}]`);
        const hackyFilePath = `../../../Library/Application Support/com.wizards.mtga/Logs/Logs/${mostRecentLog}`
        // Need to check if mtg fires this twice
        fs.watchFile(hackyFilePath, constructLogEventHandler(hackyFilePath))
    } else {
        console.error('Log path was correct but no log files were found there...')
    }

}).catch(err => {
    console.error('shit... can\'t find the logs dir', err);
});