import { reactive } from "vue"
import { WebCollection } from "./mongocli"

// 初始化数据表
class DB {
    books = new WebCollection("books") // 图书管理表
    users = new WebCollection("users") // 用户管理表
    authors = new WebCollection("authors") // 作者管理表
    publishers = new WebCollection("publishers") // 出版商管理
    booktypes = new WebCollection("booktypes") // 图书类型管理
}

export var db = new DB()


function add(prop, label, opt?) {
    return { label: label, prop: prop , opt: opt}
}

export interface DF{
    db: WebCollection | any
    format: any
}
// 图书管理
export var books_define = reactive(<DF>{
    db: db.books,
    format: [
        add("name", "图书名"),
        add("author", "作者", {ref_db: db.authors, key:"name"}),
        add("publisher", "出版社", {ref_db: db.publishers, key:"name"}),
        add("type", "类型", {ref_db: db.booktypes, key:"name"}),
        add("desc", "简介", {type:"textarea"}),
    ]
})
// 用户管理
export var users_define = reactive(<DF>{
    db: db.users,
    format: [
        add("name", "用户名"),
        add("phone", "电话"),
        add("addr", "住址"),
    ]
})

// 作者管理
export var authors_define = reactive(<DF>{
    db: db.authors,
    format: [
        add("name", "作者名"),
        add("desc", "简介", {type:"textarea"}),
    ]
})

// 出版商管理
export var publishers_define = reactive(<DF>{
    db: db.publishers,
    format: [
        add("name", "名称"),
        add("desc", "简介", {type:"textarea"}),
    ]
})
// 图书类型管理
export var booktypes_define = reactive(<DF>{
    db: db.booktypes,
    format: [
        add("name", "类型名称"),
        add("desc", "简介", {type:"textarea"}),
    ]
})

