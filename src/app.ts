import fs from 'fs';
import {constructLogEventHandler} from './gameLogListener';
import {clickPlayMatch, setWindowInfo} from './mouseInteractions';

console.log('Server is up');

// TODO: find a not garbage way to do this
fs.promises
  .readdir('../../../Library/Logs/Wizards Of The Coast/MTGA')
  .then(async files => {
    const mostRecentLog = files
      .filter(fileName => fileName === 'Player.log')
      .sort()
      .pop();

    await fs.promises.writeFile(
      '../../../Library/Logs/Wizards Of The Coast/MTGA/Player.log',
      ''
    );

    if (mostRecentLog) {
      console.log(`Reading from [${mostRecentLog}]`);
      const hackyFilePath = `../../../Library/Logs/Wizards Of The Coast/MTGA/Player.log`;
      // Need to check if mtg fires this twice
      fs.watchFile(hackyFilePath, constructLogEventHandler(hackyFilePath));
      setWindowInfo().then(() => {
        clickPlayMatch();
      });
    } else {
      console.error(
        'Log path was correct but no log files were found there...'
      );
    }
  })
  .catch(err => {
    console.error("shit... can't find the logs dir", err);
  });
