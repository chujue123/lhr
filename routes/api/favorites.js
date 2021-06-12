let mongodb = require('../../lib/mongod');
let express = require('express');
let router = express.Router();
let pathObj = require('path');

router.post('/', (req, res, next) => {
    let { _id, newsId } = req.query;
    mongodb.open({ collectionName: 'favorites' })
        .then(({ collection, client, ObjectId }) => {
            collection.find({ _id: ObjectId(_id) }).toArray((err, result) => {
                if (err) {
                    res.send({ err: 1, msg: '集合操作失败' });
                    client.close();
                } else {
                    let flag = false
                    if (result.length !== 0) {
                        result[0].newsId.forEach((ele, ind) => {
                            if (ele === newsId) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            res.send({ err: 1, msg: '已收藏' })
                        } else {
                            result[0].newsId.push(newsId);
                            collection.updateOne({ _id: ObjectId(_id) }, { $set: { newsId: result[0].newsId } }, (err, result) => {
                                if (err) {
                                    res.send({ err: 1, msg: '收藏失败' + err })
                                } else {
                                    res.send({ err: 0, msg: '收藏成功', data: result[0] })
                                }
                                client.close();
                            });
                        }
                    } else {
                        collection.insertOne({ _id: ObjectId(_id), newsId: [newsId] }, (err, result) => {
                            if (err) {
                                res.send({ err: 1, msg: '收藏失败' + err })
                            } else {
                                res.send({ err: 0, msg: '收藏成功', data: result.ops[0] })
                            }
                            client.close();
                        })

                    }

                }

            })
        })

})

module.exports = router;