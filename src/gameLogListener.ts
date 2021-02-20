import fs from 'fs';

export const constructLogEventHandler = (activeLogFile: string) => {
    let currentIndex = 0;

    return async () => {
        const newValue = await new Promise<string>(((resolve) => {
            let readData = ''
            fs.createReadStream(activeLogFile, {
                encoding: 'utf-8',
                start: currentIndex
            }).on('data', (data) => {
                readData += data;
                console.log(data.length, 'is data')
            }).on('error', (err) => {
                console.error(err)
            }).on("end", () => { resolve(readData); })
        }));
        currentIndex += newValue.length;

        console.log(newValue.length)

        if (newValue.includes('Event.MatchCreated')) {
            console.log("Match has been created!");
        }
        if (newValue.includes('GREMessageType_GameStateMessage')) {
            console.log("Game State Event!");
            console.log(newValue);
        }
    }
}
// cool events