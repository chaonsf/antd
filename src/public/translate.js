import moment from 'moment';
export default class chat{
      constructor(cfg){  
          this.cfg=cfg
      }
      chat(){
          var html=""
          html+=`${this.showTime()}`;
          this.cfg.forEach((item)=>{
               if(item.chat_type=="text"){
                   html+=`
                      <li class="left" >
                         <div class="userimg" style="background-image:url(${item.robot_img_url})">
    
                         </div>
                         <div class="usercontent" style="width: auto"> <span class="context">${item.text.html}</span> </div>
                      </li>
                   `
               }else if(item.chat_type=="imagetext"){
                    html+=`
                       <li class="left">
                          <div class="userimg" style="background-image:url(${item.robot_img_url})">
                             
                          </div>
                          <div class="usercontent"  style="width: calc(100% - 90px)">
                             <div class="weui-panel weui-panel_access">
                                 <div class="weui-panel__hd">
                                     <img src="${item.imagetext.image_url}" style="width:100%;height:50px;">
                                     <p class="watermark">${item.imagetext.watermark}
                                     </p>
                                  </div>
                                  ${this.imageList(item.imagetext.list)}
                             </div>
                          </div>
                       </li>
                    `
               }else if(item.chat_type=="list"){
                   html+=`
                     <li class="left">
                        <div class="userimg" style="background-image:url(${item.robot_img_url})">
                        </div>
                        <div class="usercontent"  style="width: calc(100% - 90px)">
                           <div class="weui-panel weui-panel_access">
                                ${this.imageList(item.list)}
                           </div>
                        </div>
                     </li>
                   `
               }else if(item.chat_type=="options"){   //options
                   html+=`
                      <li class="left">
                        <div class="userimg" style="background-image:url(${item.robot_img_url})">
        
                        </div>
                        <div class="usercontent"  style="width: calc(100% - 90px)">
                             <span class="title">${item.options.title}</span>
                             ${this.optionsBtn(item.options.list)}
                        </div>
                      </li> 
                   `
               }else if(item.chat_type=="message"){
                   html+=`
                      <li class="message">
                         ${item.message.html}
                      </li>
                   `
               }else if(item.chat_item=="command"){
                    eval(item.methods)
               }
          })
          return html
      }
      imageList(lists){  
            let html='';
            lists.forEach((item)=>{
                html+=`
                   <div class="weui-panel__bd">
                       <a href="${item.href?item.href:'javascript:;'}" class="weui-media-box weui-media-box_appmsg">
                           <div class="weui-media-box__bd">
                                ${item.html}
                           </div>
                           ${this.thumb(item)}
                       </a>
                   </div>
                `
            })
           return html 
      }
      thumb(item){  //有没有缩略图
        let html='';
          if(item.thumb){
              html=`
                 <div class="weui-media-box__hd">
                    <img class="weui-media-box__thumb" src="${item.thumb}">
                 </div>
              `
          }
          return html;
      }
      optionsBtn(buttons){   /* options时可选择的按钮 */
           let html='';
           buttons.forEach((item)=>{
               html+=`
               <p><span class="linkbutton" data-val="${item.value?item.value:''}" data-command="${item.command?item.command:''}"><a href="javascript:;">${item.html}</a>${this.btnImg(item)}</span></p>
               `
           })
           return html
      }
      btnImg(img){
          let html="";
          if(img.thumb){
              html=`
                 <img src="${img.thumb}" style="position: absolute;width:30px;right:10px">
              `
          }
          return html
      }
      showTime(){
          let html='';
          let time=moment();
          let shijian=time.format("YYYY年MM月DD日 HH:mm");
          let timeRecord=localStorage.getItem("time");
          if(timeRecord){   //每隔五分钟显示一次时间
             let before= moment().subtract(5,"minutes");
              if(before.isAfter(timeRecord)){
                html+=`
                 <li class="message">
                     ${shijian}
                 </li>
               `
               localStorage.setItem("time",time)
              }
               
          }else{
            html+=`
              <li class="message">
                ${shijian}
              </li>
            `
            localStorage.setItem("time",time)
          }
          return html
      }

}