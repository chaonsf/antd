export default class intell{
      constructor(cfg){   //传入所有需要搜索的数据
          this.cfg=cfg
      }
      selectIntellSenseData(value){  //value 为输入框的值,根据数组的每一项的keywords进行匹配，删选出符合要求的感知数据
            let arr=[];
            let data=this.cfg;
            for(let i=0;i<data.length;i++){
                let keywords=data[i].keywords;
                for(let j=0;j<keywords.length;j++){
                      let item=keywords[j]
                      if(value.includes(item)){
                            arr.push(data[i]);
                            break;
                      }
                }
            }
          return arr
     }
     orderBySelectData(data){  //快速排序
        if(data.length<=1){
            return data
        }
        let pivotIndex=Math.floor(data.length/2);
        let pivot=data.splice(pivotIndex,1)[0];
        let left=[];
        let right=[];
        for(var i=0;i<data.length;i++){
            if(data[i].level<pivot.level){
                left.push(data[i])
            }else{
                right.push(data[i])
            }
        }
        return this.orderBySelectData(left).concat([pivot],this.orderBySelectData(right))
     }
     compare(attr){  //sort排序和上面的orderBySelectData快速排序二选一即可
        return function(a,b){
            let value1=a[attr];
            let value2=b[attr];
            return value1-value2
        }
    }
}