// database load module
import { join } from 'node:path';
import { readFileSync, writeFile } from 'node:fs';

import { currentDir } from '../utility.js';

const dataFileName = join(currentDir, 'data', 'todos.json');

const dataFile = readFileSync(dataFileName, 'utf-8');
const database = JSON.parse(dataFile);

export { database };

export function saveDataBase() {
    const s = JSON.stringify(database, null, 2);
    writeFile(dataFileName, s, 'utf-8', (err) => {
        if (err) {
            console.error('Error', err);
            return;
        }
        console.log('DataBase complete')
    });
}

export function getObjectId() {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    })
}