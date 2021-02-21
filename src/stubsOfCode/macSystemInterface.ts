import {exec} from 'child_process';

export const getArenaSizeAndPosition = (): Promise<ArenaWindowInfo> => {
  return new Promise(resolve => {
    exec(
      `osascript -e 'tell application "System Events"
            set windowSize to the size of window 1 of(processes whose name is "MTGA")
            set windowPosition to the position of window 1 of(processes whose name is "MTGA")
            return windowSize & "sp" & windowPosition
        end tell'`, null, (error, output, stderror) => {

            const values = (output as string).split(`, sp, `)
            const [width, height] = values[0].split(', ');
            const [x, y] = values[1].split(', ');
            resolve({ x: parseInt(x), y: parseInt(y), width: parseInt(width), height: parseInt(height) });
        })
    })
}

export interface ArenaWindowInfo {
    x: number
    y: number
    width: number
    height: number
}
