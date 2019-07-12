import api from './interApi';
import qs from 'qs';


class axiosApi{
    constructor(){
    
    }
    sendGet(url,params={}){
         if(Object.prototype.toString.call(params) === '[object Object]'){
            return api.createAxios.get(url, {params: params})
         }else{
            const error = new Error('参数错误！')
            try {
                throw error
            } catch (error) {
                 console.log("get:",error)
            }
         }
    }
    sendPost(url,params={}){
        if(Object.prototype.toString.call(params) === '[object Object]'){
            return api.createAxios.post(url,params)   /* qs.stringify(paramns) */
        }else{
            const error = new Error('参数错误！')
            try {
                throw error 
            } catch (error) {
                 console.log("post:",error)
            }
        }
    }
    sendAll(arr){
        return new Promise((resolve,reject)=>{
             api.sendAll(arr).then(res=>{
                 return resolve(res)
             })
        })
    }

}
export default axiosApi