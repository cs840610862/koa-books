
<template>
  <div>
    <el-button @click="showInsertOne">添加</el-button>
  </div>
  <el-dialog v-model="uiData.dialogVisible" title="添加">
    <Form></Form>
  </el-dialog>
  <App />
</template>

<script setup lang='tsx'>
import { onMounted, reactive, VNode } from "vue";
import { tip } from "../tip";
import { DF } from "@/db";

interface Prop {
  df: DF
}

const props = defineProps<Prop>()

let uiData = reactive({
  pageNum: 1,
  pageSize: 20,
  list: [],
  count: 0,
  dialogVisible: false,
  dialogAction: "add", // add[添加], modified[修改]
});

let formData = reactive({
  data: {} as any,
  options: {} as any,
})
// 点击添加
let showInsertOne = () => {
  formData.data = {}
  uiData.dialogAction = "add"
  uiData.dialogVisible = true
}

let showModifyOne = (row) => {
  formData.data = row
  uiData.dialogAction = "modify"
  uiData.dialogVisible = true
  }

let hideDialog = () => {
  uiData.dialogVisible = false
}

let query = async () => {
  let [resp, err] = await props.df.db.findMany(
    uiData.pageNum,
    uiData.pageSize,
    {}
  );
  if (err) {
    return tip.e(err);
  }

  uiData.count = resp.count;
  uiData.list = resp.list;
};


let queryOneRef = async (prop, opt) => {
  let [resp, err] = await opt.ref_db.findAll()
  if (err) {
    return tip.e(err);
  }

  let mp = {}
  for (let v of resp.list) {
    mp[v._id] = v[opt.key]
  }

  formData.options[prop] = {
    list:resp.list,
    map: mp,
  }
}

let queryAllRef = async () => {
  formData.options = {}
  for (let v of props.df.format) {

    if (v.opt && v.opt.ref_db) {
      queryOneRef(v.prop, v.opt)
    }
  }
}

let modifyOne = async () => {
  let id = formData.data._id
  delete formData.data._id
  let [_, err] = await props.df.db.updateOne( {_id: id}, {
    "$set": formData.data
  })
  if (err) {
    tip.e(err)
  } else {
    tip.s("修改成功")
  }
  query()
  hideDialog()
}

let addOne = async () => {
  let [_, err] = await props.df.db.insertOne(formData.data)
  if (err) {
    tip.e(err)
  } else {
    tip.s("添加成功")
  }
  query()
  hideDialog()
}

let deleteOne = async (id) => {
  let s = await tip.ask("是否删除此条记录?")
  if (s != "ok") {
    return
  }

  let [_, err] = await props.df.db.deleteOne({ _id: id })
  if (err) {
    tip.e(err)
  } else {
    tip.s("删除成功")
  }
  query()
  hideDialog()
}
// 创建select选择框
const createSelect = (v) => {
  let options: VNode[] = []

  for (let oneOpt of formData.options[v.prop].list) {
    options.push(

      <el-option
        label={oneOpt[v.opt.key]}
        value={oneOpt._id}
      >
      </el-option>
    )
  }

  return <el-form-item label={v.label} >
    <el-select v-model={formData.data[v.prop]} placeholder="请选择">
      {options}
    </el-select>

  </el-form-item>
}

// 生成管理页面的添加表单
const Form = () => {

  let list: VNode[] = []
  for (let v of props.df.format) {

    if (v.opt && v.opt.ref_db) {

      list.push(createSelect(v))

    } else {
      list.push(
        <el-form-item label={v.label} >
          <el-input v-model={formData.data[v.prop]} type={v.opt && v.opt.type ? v.opt.type : ""} />
        </el-form-item>
      )
    }
  }

  return <el-form label-width="120px">
    {list}

    <el-form-item >
      <el-button type="primary" onClick={
        uiData.dialogAction == "add" ? addOne : modifyOne
        
        } >{
        uiData.dialogAction == "add" ? "确认添加" : "确认修改"
        }</el-button>
    </el-form-item>
  </el-form>
}

let last_df: DF
// table列表渲染
const App = () => {
  let list: VNode[] = []

  if (props.df != last_df) {
    last_df = props.df
    query()
    queryAllRef()
  }

  for (let v of props.df.format) {
    list.push(<el-table-column prop={v.prop} label={v.label}
      v-slots={{
        default: (scope) => {
          let val = scope.row[v.prop]
          let ref = formData.options[v.prop]
          if(ref && ref.map) {
            return <div>{ref.map[val]}</div>
          }

          return <div>{val}</div>
        }
      }}
    > </el-table-column>)
  }

  return <el-table data={uiData.list}>
    {list}
    <el-table-column label="操作" width="140"

      v-slots={{
        default: (scope) => {
          return <>
            <el-button type="primary" size="small" onClick={() => showModifyOne(scope.row)}>修改</el-button>
            <el-button type="danger" size="small" onClick={() => deleteOne(scope.row._id)}>删除</el-button>
          </>
        }
      }}>
    </el-table-column>

  </el-table>
}
</script>