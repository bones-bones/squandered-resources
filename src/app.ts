import fs from 'fs'

console.log('Server is up');


// TODO: find a not garbage way to do this
fs.promises.readdir('../../../Library/Application Support/com.wizards.mtga/Logs/Logs').then(files => {
    const mostRecentLog = files.filter(fileName => fileName.includes('UTC_Log')).sort().pop();
    if (mostRecentLog) {
        console.log(`Reading from [${mostRecentLog}]`);
        fs.watchFile(`../../../Library/Application Support/com.wizards.mtga/Logs/Logs/${mostRecentLog}`,
            (fileChangeEvent) => { console.log('it moved', fileChangeEvent); })
    } else {
        console.error('Log path was correct but no log files were found there...')
    }

}).catch(err => {
    console.error('shit... can\'t find the logs dir', err);
});