import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';


function db () {
    const adapter = new FileSync('db.json');
    const db      = low(adapter);

    return db.get('posts');
}

export function getPosts () {
    return db().value();
}

export function addPost () {
    db().push({ id: 2, title: 'Temp'}).write();
}

export function removePost () {
    db().remove({ id: 2 }).write();
}
