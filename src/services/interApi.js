import axios from 'axios';
const createAxios=axios.create({
    baseURL:"",
    withCredentials: true,
    headers: {"content-type":"application/json"}
})

//拦截器配置
createAxios.interceptors.request.use(configData=>{  //请求拦截，在发送请求之前做些什么
   // 请求成功做的事情 configData 中包含：url、method等信
   return configData
},error=>{  //请求失败做的事情
    return Promise.reject(error)
})
createAxios.interceptors.request.use(res=>{  //响应拦截，对响应数据做点什么
    //响应成功做的事情
   /*  console.log("res:",res) */
    return res
},error=>{ //响应失败做的事情
    return Promise.reject(error)
})


function sendAll(arr){  //顺序和请求发送的顺序相同，使用 axios.spread 分割成多个单独的响应对象
     if(Object.prototype.toString.call(arr) === '[object Array]'){
          return axios.all(arr).then(axios.spread(function(...res){
              // 请求全部都执行完成
                return Promise.resolve(res)
  
          }))
     }else{
        const error = new Error('参数错误！')
        try {
            throw error
        } catch (error) {
            //
            console.log(error)
        }
     }
}
export default{
    createAxios,
    sendAll
}