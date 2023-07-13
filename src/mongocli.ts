function POST(url: string, send: any): Promise<[any, any]> {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                res([data, null])
            }
        };

        xhr.onerror = function (e) {
            rej([null, e])
        };

        xhr.send(JSON.stringify(send));
    })
}

export class WebCollection {
    name: string
    constructor(n: string) {
        this.name = n
    }

    insertOne(doc: any): Promise<[any, any]> { return this.exec("insertOne", doc) }
    findOne(query: any): Promise<[any, any]> { return this.exec("findOne", query) }
    updateOne(query: any, update: any): Promise<[any, any]> { return this.exec("updateOne", query, update) }
    deleteOne(query: any): Promise<[any, any]> { return this.exec("deleteOne", query) }
    countDocuments(query: any): Promise<[any, any]> { return this.exec("countDocuments", query) }

    async findAll() : Promise<[any,any]> {
        let [list, err] = await this.execWith({
            collection: this.name,
            method: "findMany",
            args: {},
        }) 
        if (err) {
            return [null, err]
        }
        return [{list:list}, null]
    }
    
    async findMany(pageNum: number, pageSize: number, query: any): Promise<[any, any]> {
        let [list, err] = await this.execWith({
            collection: this.name,
            method: "findMany",
            args: query,
            skip: (pageNum - 1) * pageSize,
            limit: pageSize,
        })
        if (err) {
            return [null, err]
        }
        let [count, err2] = await this.countDocuments(query)
        if (err2) {
            return [null, err]
        }

        return [{
            list: list,
            count: count,
        }, null]
    }

    private async execWith(data: any): Promise<[any, any]> {
        let [resp, err] = await POST("/api/mongo", data)
        if (err != null) {
            return [null, err]
        }

        if (resp.error) {
            return [null, resp.error]
        }

        return [resp.data, null]
    }

    private async exec(cmd: string, ...args): Promise<[any, any]> {
        return this.execWith({
            collection: this.name,
            method: cmd,
            args: args,
        })
    }
}

export function isDuplicateError(err) {
    if (err != null && err.code == 11000) {
        return true
    }
    return false
}
