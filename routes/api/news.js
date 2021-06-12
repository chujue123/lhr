let mongodb = require('../../lib/mongod');
let express = require('express');
let router = express.Router()

router.get('/:name', (req, res, next) => {
    let collectionName = req.params.name;
    console.log(collectionName);
    let { _limit, _page, _sort, p } = req.body;
    console.log(req.query);
    mongodb.findList({ _limit, _page, _sort, collectionName, p }).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err);
    })

});

router.get('/:name/:_id', (req, res, next) => {
    let collectionName = req.params.name;
    let _id = req.params._id;
    mongodb.findDetail({
        collectionName,
        _id,
    }).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err);
    })
})


module.exports = router;