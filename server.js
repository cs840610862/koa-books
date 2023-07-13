import http from "http"
import { MongoClient , ObjectId} from 'mongodb'
const client = await MongoClient.connect('mongodb://localhost:27017');
const db = client.db("book");


function readRequestBody(req)  {
    return new Promise(resolve => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(data);
        });
    });
}

function convertID(t) {
    if (t._id) {
        t._id =  new ObjectId(t._id)
    }
}

const server = http.createServer(async (req, res) => {
    const url = req.url;

    const requestBody = await readRequestBody(req);

    let o = JSON.parse(requestBody)
    let resp 

    try {
        let func = o.method

        if (Array.isArray(o.args)) {
            // 修改或者
            convertID(o.args[0])
        } else {
            convertID(o.args)
        }
        
        console.log(`<- ${url} ${JSON.stringify(o)}`);
        if (func == "findMany") {
            // 查询数据
            resp = db.collection(o.collection).find(o.args)
            if (o.skip !== undefined && o.skip !== null) {
                resp.skip(o.skip)
            }
            if (o.limit !== undefined && o.limit !== null) {
                resp.limit(o.limit)
            }

            resp = await resp.toArray()
        } else {
            resp = await db.collection(o.collection)[func](...o.args)
        }

        resp = {data: resp}
    } catch(e) {
        console.log(e)
        resp = {error: e}
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    console.log('resp', resp)
    res.end(JSON.stringify(resp));
});


server.listen(3001, () => {
    console.log('Server listening on http://localhost:3001');
});