let jwt = require('./jwt');
module.exports = (req, res, next) => {
    //处理公共参数  address !address headers
    req.query._page = req.query._page ? req.query._page - 1 : require('../config/query-rules')._page;
    req.query._limit = req.query._limit ? req.query._limit - 0 : require('../config/query-rules')._limit;
    req.query.p = req.query.p ? req.query.p : require('../config/query-rules').p;
    req.query._sort = req.query._sort ? req.query._sort : require('../config/query-rules')._sort;

    req.body._page = req.body._page ? req.body._page - 1 : require('../config/query-rules')._page;
    req.body._limit = req.body._limit ? req.body._limit - 1 : require('../config/query-rules')._limit;
    req.body.p = req.body.p ? req.body.p : require('../config/query-rules').p;
    req.body._sort = req.body._sort ? req.body._sort : require('../config/query-rules')._sort;


    req.headers._page = req.headers._page ? req.headers._page - 1 : require('../config/query-rules')._page;
    req.headers._limit = req.headers._limit ? req.headers._limit - 1 : require('../config/query-rules')._limit;
    req.headers.p = req.headers.p ? req.headers.p : require('../config/query-rules').p;
    req.headers._sort = req.headers._sort ? req.headers._sort : require('../config/query-rules')._sort;

    if (/reg|login|logout/.test(req.url)) {
        next()
    } else {
        let token = req.body.token || req.headers.token || req.query.token
        jwt.verify(token).then((decode) => {
            req.detoken = decode;
            next();
        }).catch((message) => {
            res.send({ err: 1, msg: 'token过期或校验失败' + message })
        })

    }

}