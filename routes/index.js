const express = require('express');

const low      = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const router = express.Router();

const getPosts = () => {
    const adapter = new FileSync('./db.json');
    const db      = low(adapter);

    return db.get('posts');
};

/* GET home page. */
router.get('/', function (req, res) {
    const posts = getPosts().value();

    res.render('index', { title: 'Express', posts });
});

router.get('/add', function (req, res) {
    const posts = getPosts();

    posts.push({ id: 2, title: 'Temp' }).write();

    res.redirect('/');
});

router.get('/remove', function (req, res) {
    const posts = getPosts();

    posts.remove({ id: 2 }).write();

    res.redirect('/');
});

module.exports = router;
