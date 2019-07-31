import React ,{ Component,Fragment } from 'react';
import '../scss/chatroom.scss';
import {Button,Input,message} from 'antd'
import server from "../services/extendApi";
import intell from '../public/intellSence';
import trans from '../public/translate'
let api=new server()

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
          let obj={
               user_type:"MEMBER"   //toB这个参数为CHANNEL
           }
          api.sendPost("../post_chat/welcome",obj).then(res=>{
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
          let obj={ user_type:"MEMBER" };
           api.sendPost("../post_chat/download_suggest",obj).then(res=>{
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
               let obj={"question":value, user_type:"MEMBER" };
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
           let obj;
           if(value==text){
               obj={"question":value, user_type:"MEMBER" }
           }else{
               obj={"value":value, user_type:"MEMBER" } 
           }
          let stext="您已选择了 【"+text+"】";
          this.right(stext);
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
            let right=`
                  <div class="userimg" style="background-image:url(${this.state.client_img_url})"> </div>
                  <div class="usercontent" style="width: auto"> <span class="context">${value}</span> </div>
            `
            let $dom=document.getElementsByClassName("chat")[0];
            let $ul=$dom.getElementsByTagName("ul")[0];
            var newEle = document.createElement("li");
            newEle.innerHTML=right;
            newEle.setAttribute('class','right')
            $ul.appendChild(newEle)
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
              this.setState({
                   tipsHtml:html
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
            console.log("加载更多")
       }
       render(){
            const bg={
               backgroundImage:`url(${require("../image/xiangxiajiantou.png")})`,
            }
            return(
                <div className='chatRoot'>
                     <div className="chat_title" dangerouslySetInnerHTML={{__html:this.state.headImg}}></div>
                     <div className='chat' ref='chat' onScroll={this.scroll.bind(this)}>
                          {this.state.history?(<div className='more' onClick={this.dealHistory.bind(this)}>查看更多消息</div>):(<Fragment></Fragment>)}
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
