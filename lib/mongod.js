let mongodb = require("mongodb");
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;

let open = ({ dbName = '2101', collectionName, url = 'mongodb://127.0.0.1:27017' }) => {
    return new Promise((resolve, reject) => {
        mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {

            if (err) {
                console.log(err);
                reject({
                    err: 1,
                    msg: '连接失败',
                    client
                })

            } else {
                let db = client.db(dbName)
                let collection = db.collection(collectionName);


                resolve({
                    err: 0,
                    msg: '连接成功',
                    client,
                    collection,
                    ObjectId
                })
            }

        });
    })
}

let findList = ({ dbName, collectionName, url = 'mongodb://127.0.0.1:27017', _limit, _page, _sort, p }) => {
    //p为查询条件，是一个对象
    return new Promise((resolve, reject) => {

        open({ dbName, collectionName, url })
            .then(({ client, collection }) => {


                let skipNum = (_limit - 0) * (_page - 0);
                collection.find(p, {
                    limit: (_limit - 0),
                    skip: skipNum,
                    sort: {
                        [_sort]: 1
                    }
                }).toArray((err, result) => {

                    if (!err && result.length > 0) {
                        resolve({
                            error: 0,
                            msg: '查询成功',
                            data: result
                        })
                    } else {
                        reject({
                            error: 1,
                            msg: '查询失败',
                        })
                    }
                    client.close();
                })
            }).catch(({ client }) => {
                reject({
                    error: 1,
                    msg: '库连接失败',
                })
                client.close();
            })
    })
}

let findDetail = ({ dbName, collectionName, url = 'mongodb://127.0.0.1:27017', _id }) => {
    return new Promise((resolve, reject) => {
        open({ dbName, collectionName, url })
            .then((client, collection) => {
                // console.log(client.collection);
                collection = client.collection
                collection.find({ _id: _id }).toArray((err, result) => {
                    console.log(err);
                    console.log(result);
                    if (!err && result.length > 0) {
                        resolve({
                            error: 0,
                            msg: '查询成功',
                            data: result[0]
                        })
                    } else {
                        reject({
                            error: 1,
                            msg: '查询失败',
                        })
                    }

                })
                client.close();
            })
    }).catch(({ client }) => {
        reject({
            error: 1,
            msg: '库连接失败',
        })
        client.close();
    })
}
exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;