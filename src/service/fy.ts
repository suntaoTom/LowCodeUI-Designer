import { get, post } from "@/utils/fetch";

var data:any={
    "@lowcodeui/element-button_0.0.1":{
        js:['app.c952d795.js','chunk-vendors.9f4cb929.js'],
        css:['app.001bfc3b.css','chunk-vendors.d7bf6fa5.css']
    }
}

export async function fileDisplay(req:any){
    let host=req.name+'/dist'
    let css:any = []
  let js:any = []
  let e:any=[]
  data[req.name].js.map((val:any)=>{
    e.push('/js/'+val)
  })
  data[req.name].css.map((val:any)=>{
    e.push('/css/'+val)
  }) 
  for (let index = 0; index < e.length; index++) {
    let a=await get(`${host}${e[index]}`, {})
    index===0||index===1?js.push(a):css.push(a)
  }
  console.log(111,js,css)
  return  { msg: true, status: 1, name: req.name, version: req.version, js: js.reverse(), css: css }
}