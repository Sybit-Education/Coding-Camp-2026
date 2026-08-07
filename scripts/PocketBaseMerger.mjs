import PocketBase from 'pocketbase';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pb = new PocketBase('https://cc26-db.sybit.education');

const COLLECTION = 'lexiconEntries';


const raw = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'mettnau_lexikon_erweitert.json'), 'utf-8')
);
const newEntries = raw.items;

let created = 0;
let updated = 0;
let failed = [];

for (const entry of newEntries) {
  // PocketBase-Metafelder rausfiltern, die nicht mitgeschickt werden dürfen
 const { id, collectionId, collectionName, created: _created, updated: _updated, media, ...data } = entry;

  try {
    await pb.collection(COLLECTION).getOne(id);
    await pb.collection(COLLECTION).update(id, data);
    updated++;
  } catch (err) {
    if (err.status === 404) {
      await pb.collection(COLLECTION).create({ id, ...data });
      created++;
    } else {
      failed.push({ id, error: err.message });
    }
  }
}

console.log(` Updated: ${updated}`);
console.log(` Created: ${created}`);
if (failed.length) {
  console.log(` Failed: ${failed.length}`, failed);
}
