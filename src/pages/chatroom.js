import React ,{ Component,Fragment } from 'react';
import '../scss/chatroom.scss';
import {Button,Input,message} from 'antd'
import server from "../services/extendApi";
import intell from '../public/intellSence';
import trans from '../public/translate'
let api=new server()
const midObj={
     user_type:"MEMBER"
}
class Chat extends Component{
       constructor(props){
           super(props)
           this.state={
               client_img_url:"",
               headImg:"",
               intelliSenseData:[], //智能感知数据
               tips:{},  //智能提示样式
               arrow:{} ,//箭头样式
               sendcontent:"",// 输入框值
               tipsHtml:"",//智能提示html
               st:0,
               history:false,//控制是否有更多历史消息
           }
       }
       componentDidMount(){
            this.intelliSense()
            this.load()
            this.setPosition();
            localStorage.removeItem("time");
       }
       load(){
          api.sendPost("../post_chat/welcome",midObj).then(res=>{
                let data=res.data;
                this.setState({
                     client_img_url:data[0].client_img_url
                })
                let first=data[0].company_logo_url;
                let title
                if(first){
                     title=`
                       <img class="title_logo custom" src="${first}">
                       <img class="title_logo custom" src="${data[0].channel_logo_url}">
                     ` 
                }else{
                     title=`
                        <img class="title_logo custom" src="${data[0].channel_logo_url}">
                     `
                }
                this.setState({
                      headImg:title
                })
                if(data[0].has_chat_history=="Y"){
                     this.setState({
                          history:true
                     })
                }
                let newTrans=new trans(data);
                let html=newTrans.chat();
                let $dom=document.getElementsByClassName("chat")[0];
                let $ul=$dom.getElementsByTagName("ul")[0];
                var newEle = document.createElement("Fragment");
                newEle.innerHTML=html;
                $ul.appendChild(newEle)
                this.linkbuttonClick()

          })
       }
       intelliSense(){  //加载智能感知数据
           api.sendPost("../post_chat/download_suggest",midObj).then(res=>{
                  this.setState({
                    intelliSenseData:res.data
                  })
           })
       }
       setPosition(){
            let $foot=document.getElementsByClassName("foot")[0];
            let tipsheight=$foot.getBoundingClientRect().height;
            let $func=document.getElementsByClassName("func")[0];
            let  arrowheight=$func.getBoundingClientRect().height;
            this.setState({
               tips:Object.assign(this.state.tips,{
                 position:"absolute",
                 bottom:tipsheight,
                 left:0
               }),
               arrow:Object.assign(this.state.arrow,{
                    bottom:arrowheight+tipsheight+20,
                    display:"none"
               })
         })
           
       }
       onChange=e=>{
            console.log(e)
          this.setState({
               sendcontent:e.target.value
          })
       }
       checkBlank(str){   //避免全部输入空格
          while(str.lastIndexOf(" ")>=0){
              str = str.replace(" ","");
            }
            if(str.length == 0){
               return false
            }else{
                return true
            }
       }
       send(){
           let value=this.state.sendcontent;
           let space=this.checkBlank(value)
           if(space){
               let $chat=document.getElementsByClassName("chat")[0];
               this.right(value);
               let st=$chat.scrollHeight;
               this.setState({
                   st:st,
                   sendcontent:"",
                   tipsHtml:""
               })
               let mid={"question":value,comment:value }
               let obj=Object.assign(mid,midObj)
               this.reply(obj)
           }else{
               message.error("请先输入内容")
           }
       }
       reply(obj){
            this.unclick();
            let $chat=document.getElementsByClassName("chat")[0];
            let sh=$chat.scrollHeight;
            api.sendPost("../post_chat/reply_text",obj).then(res=>{
                  let arr=res.data;
                  if(Object.prototype.toString.call(res.data) === '[object Object]'){
                    arr=[res.data]
                  }
                 let newTrans=new trans(arr);
                 let shtml=newTrans.chat();
                 let $ul=$chat.getElementsByTagName("ul")[0];
                 var newEle = document.createElement("Fragment");
                 newEle.innerHTML=shtml;
                 $ul.appendChild(newEle);
                 this.linkbuttonClick();
                 let sh2=$chat.scrollHeight;
                 let baseHeight=30
                 let dpi=window.devicePixelRatio
                 if(dpi){
                    baseHeight=30*dpi
                 }
                 $chat.scrollTop=this.state.st+window.innerHeight-$chat.clientHeight-sh2+sh+baseHeight
            })
       }
       linkbuttonClick(){
            let li=this.refs.ul.getElementsByClassName("left");
            let index=li.length;
            let $last=li[index-1];
            let $link=$last.getElementsByClassName("linkbutton");
            let that=this
            for(let i=0;i<$link.length;i++){
                 (function(j){
                    $link[j].onclick=function(){
                          let command=$link[j].getAttribute("data-command");
                          if(command){
                               //后面换函数
                               console.log("command:",command)
                          }else{
                               let value=$link[j].getAttribute("data-val");
                              let a=$link[j].getElementsByTagName("a")[0];
                              let text=a.innerHTML;
                              if(value){
                                   that.select(value,text) 
                              }else{
                                   that.select(text,text)    
                              }
                              
                          }
                    }
                 }(i))
            }
       }
       unclick(){  //解除事件绑定
          let li=this.refs.ul.getElementsByClassName("left");
          let index=li.length;
          let $last=li[index-1];
          let $link=$last.getElementsByClassName("linkbutton");
          let that=this
          for(let i=0;i<$link.length;i++){
               (function(j){
                    $link[j].onclick=null  
               }(i))
          }
       }
       select(value,text){
           let mid
           if(value==text){
               mid={"question":value,comment:text }
           }else{
               mid={"value":value,comment:text }
           }
           let obj=Object.assign(mid,midObj)
          this.right(text);
          this.reply(obj);
          this.scrollToBottom()
       }
       scrollToBottom(){
            let $chat=this.refs.chat;
            $chat.scrollTop=$chat.scrollHeight;
            this.setState({
                 arrow:Object.assign(this.state.arrow,{
                       display:'none'
                 })
            })
       }
       scroll(){
            let $chat=this.refs.chat;
            let scrollTop=$chat.scrollTop;
            let clientHeight=$chat.clientHeight;
            let scrollHeight=$chat.scrollHeight;
            if(scrollTop+clientHeight>=scrollHeight-50){
                  this.setState({
                        arrow:Object.assign(this.state.arrow,{
                              display:"none"
                        })
                  })
            }else{
               this.setState({
                    arrow:Object.assign(this.state.arrow,{
                          display:"block"
                    })
              })
            }
       }
       right(value){
          let right=this.rightHistory(value)
            let $dom=document.getElementsByClassName("chat")[0];
            let $ul=$dom.getElementsByTagName("ul")[0];
            var newEle = document.createElement("li");
            newEle.innerHTML=right;
            newEle.setAttribute('class','right')
            $ul.appendChild(newEle)
       }
       rightHistory(value){
          let right=`
          <div class="userimg" style="background-image:url(${this.state.client_img_url})"> </div>
          <div class="usercontent" style="width: auto"> <span class="context">${value}</span> </div>
          `
          return right
       }
       onInput(){
           let value=this.state.sendcontent;
           if(value.length>1){
               let intelliSense=new intell(this.state.intelliSenseData);
               let arr=intelliSense.selectIntellSenseData(value);
               let brr=arr.sort(intelliSense.compare("level")).reverse()
               let array;
              if(brr.length>6){
                 array=brr.slice(0,6)
              }else{
                 array=brr
              }
              let html='';
              array.forEach(item=>{
                 html+=`
                    <li value="${item.value}">${item.question}</li>
                  `
              })
              let that=this;
              this.setState({
                   tipsHtml:html
              },()=>{
                 let $tips=document.getElementsByClassName("tips")[0];
                 let $ul=$tips.getElementsByTagName("ul")[0];
                let  $li=$ul.getElementsByTagName("li");
                 for(let i=0;i<$li.length;i++){
                      (function(j){
                           $li[j].onclick=function(){
                              let value=$li[j].getAttribute("value");
                               let text=$li[j].innerHTML;
                                that.setState({
                                      tipsHtml:"",
                                      sendcontent:""
                                })
                                that.right(text)
                               let mid={"value":value,comment:text};
                               let obj=Object.assign(mid,midObj)
                               that.reply(obj);
                               that.scrollToBottom()

                           }
                      }(i))
                 }

              })
           }else{
                this.setState({
                     tipsHtml:""
                })
           }

       }
       test(){
             //测试eval是否能使用
            let aa='this.scrollToBottom()';
             eval(aa)
       }
       dealHistory(){
           api.sendPost("../post_chat/get_chat_history").then(res=>{
                  let data=res.data;
                  if(data.RETURN_CODE==0){
                       if(data.RETURN_DATE){
                            this.setState({
                                 history:true
                            })
                       }else{
                            this.setState({
                                 history:false
                            })
                       }
                     if(data.datatable.length>0){
                            this.history(data.datatable)
                     }
                  }
           })
       }
       history(data){
           let html='';
           let time=`
            <li class="message">
                ${data[0].CHAT_DATE_STRING.slice(0,16)}
            </li>
           `
           html+=time;
           data.forEach(item=>{
               let chat_desc=JSON.parse(item.CHAT_DESC);
                 if(item.ROBOT_IND==false){//left
                       if(Object.prototype.toString.call(chat_desc) === '[object Object]'){
                              if(chat_desc.comment){
                                    let shtml= this.rightHistory(chat_desc.comment);
                                    html+=shtml;
                              }
                       }else{
                           if(chat_desc[0].comment){
                               let shtml= this.rightHistory(chat_desc[0].comment);
                               html+=shtml;
                           }
                       }
                     
                 }else{ //right
                      if(Object.prototype.toString.call(chat_desc) === '[object Object]'){
                             if(chat_desc.chat_type){
                                 let arr=[chat_desc]
                                let newchat=new trans(arr);
                                let shtml=newchat.chat();
                                html+=shtml
                             }
                      }else{
                          if(chat_desc[0].chat_type){
                             let newchat=new trans(chat_desc);
                             let shtml=newchat.chat();
                             html+=shtml;
                          }
                      }
                 }
            })
            html+=`
            <li class="message bottomMessage dn">以上是历史消息</li>
          `
          let preTop=this.refs.chat.scrollHeight;
          let $ul=this.refs.ul.getBoundingClientRect();
          let $more=this.refs.more.getBoundingClientRect()
         let first=this.refs.ul.firstChild;
          let target=document.createElement("Fragment");
          target.innerHTML=html;
          this.refs.ul.insertBefore(target,first);
          let clientHeight=this.refs.chat.clientHeight
          let top=this.refs.chat.scrollHeight;
          let top2;
          if(clientHeight<preTop){
               top2=top-preTop-50;
          }else{
               top2=top-$ul.height-$more.height;
          }
          let BottMessage=this.refs.ul.getElementsByClassName("bottomMessage");
          let last=BottMessage.length-1;
          BottMessage[last].classList.remove("dn");
          this.refs.chat.scrollTop=top2;

       }
       render(){
            const bg={
               backgroundImage:`url(${require("../image/xiangxiajiantou.png")})`,
            }
            return(
                <div className='chatRoot'>
                     <div className="chat_title" dangerouslySetInnerHTML={{__html:this.state.headImg}}></div>
                     <div className='chat' ref='chat' onScroll={this.scroll.bind(this)}>
                          {this.state.history?(<div className='more' onClick={this.dealHistory.bind(this)} ref="more">查看更多消息</div>):(<Fragment></Fragment>)}
                          <ul className='item' ref="ul"></ul>
                     </div>
                     <div className='tips' style={this.state.tips}>
                         <ul dangerouslySetInnerHTML={{__html:this.state.tipsHtml}}></ul>
                    </div>
                    <div className="arrow" style={{...bg,...this.state.arrow}} onClick={this.scrollToBottom.bind(this)}>

                    </div>
                    <div className="func">
                         <ul>
                             <li className="test" onClick={this.test.bind(this)}>大治疗预检</li>
                              <li className="buy" onClick={()=>this.props.productDetail()}>产品详情</li>
                         </ul>
                    </div>
                    <div className="foot">
                        <div className="content">
                            <Input placeholder="请输入内容" value={this.state.sendcontent} onChange={this.onChange} onPressEnter={this.send.bind(this)} onInput={this.onInput.bind(this)}/>
                        </div>
                        <div className='right'>
                            <Button type="primary" className="send" onClick={this.send.bind(this)}>发送</Button>
                        </div>
                    </div>
               </div>
            )
       }
}
export default Chat
