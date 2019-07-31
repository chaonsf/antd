import React ,{ Component,Fragment} from 'react';
import '../scss/productDetail.scss'
import {Carousel,Spin,Row, Col,Drawer} from 'antd'
import server from "../services/extendApi";
let api=new server()

class ProductDetail extends Component{
       constructor(props){
           super(props)
          this.state={
               loading:true,
               swiperImg:[],
               pdpd_info:{},
               hotline:[],//客服热线
               bfbf_info:[],
               hot_info:[],//服务卖点
               content_info:[],//服务内容
               flow_info:[], //使用流程
               anchor:[],
               bar:"weui-navbar",  //navbar 样式
               onOff:false,
               href:"",// 分享预览二维码
               visible:false, //预览是否可见
          }
       }
       componentDidMount(){
             this.load();

       }
       load(){
          api.sendPost("../post_policy_product/get_policy_product_html").then(res=>{
              let data=res.data;
                let arr=[];
                if(data.hot_info){
                     arr.push( {title:"服务卖点"})
                }
                if(data.content_info){
                     arr.push({title:"服务内容"})
                }
                if(data.flow_info){
                     arr.push({title:"使用流程"})
                }
                arr.push({title:"诊所地址"})
                this.setState({
                     loading:false,
                     swiperImg:data.detail_swiper,
                     pdpd_info:Object.assign({},data.pdpd_info),
                     hotline:data.hotline?data.hotline:[],
                     bfbf_info:data.bfbf_info?data.bfbf_info:[],
                     hot_info:data.hot_info?data.hot_info:[],
                     content_info:data.content_info?data.content_info:[],
                     flow_info:data.flow_info?data.flow_info:[],
                     anchor:arr
                })
          })
       }
       tabItem(index){
             let navbar=document.getElementsByClassName("weui-navbar")[0];
             let navBarItem=navbar.getElementsByClassName("weui-navbar__item");
            if(navBarItem[index].classList.length==1){
                  this.setState({
                       onOff:true,
                  })
                  let panel=document.getElementsByClassName("weui-tab__panel")[0];
                  let child=panel.getElementsByClassName("item");
                  let _top=child[index].offsetTop+50;
                  for(let i=0;i<child.length;i++){
                       
                       if(i==index){
                            navBarItem[i].classList.add("weui-bar__item_on")
                       }else{
                         navBarItem[i].classList.remove("weui-bar__item_on") 
                       }
                  }
                  this.refs.detail.scrollTop=_top;
                  let that=this
                  setTimeout(function(){
                        that.setState({
                          onOff:false
                        })
                  },400)

            }
             
       }
       scroll(){
            let winHeight=this.refs.detail.scrollTop;
            let offsetTop=this.refs.tab.offsetTop;
            if(winHeight>=offsetTop){
               this.setState({
                    bar:"top_fiexd weui-navbar"
               })
            }else{
                 this.setState({
                      bar:"weui-navbar"
                 })
            }
            let boff=this.state.onOff;
            if(!boff){
                 let panel=document.getElementsByClassName("weui-tab__panel")[0];
                 let child=panel.getElementsByClassName("item");
                 let navbar=document.getElementsByClassName("weui-navbar")[0]
                 let navBarItem=navbar.getElementsByClassName("weui-navbar__item")
                 for(let i=0;i<child.length;i++){
                      let _top=child[i].offsetTop;
                      if(winHeight>=_top){
                           for(let j=0;j<navBarItem.length;j++){
                                if(i==j){
                                   navBarItem[j].classList.add("weui-bar__item_on")
                                }else{
                                   navBarItem[j].classList.remove("weui-bar__item_on")
                                }
                           }
                            
                      }
                 }
            }
       }
       detail(){  //点击产品详情
          let panel=document.getElementsByClassName("weui-tab__panel")[0];
          let child=panel.getElementsByClassName("item");
          let offsetHeight=child[1].offsetTop;
          this.refs.detail.scrollTop=offsetHeight;
       }
       share(){  //点击分享
           let text=encodeURIComponent(this.state.pdpd_info.GOODS_DESC);
           let shorturl="../chat/chatroom?policy";
           let abeQt=this.getAbsoluteUrl(shorturl);
           let treQt= encodeURIComponent(abeQt);
           let href="https://interface.qdental.cn/mpshopmall/File/QRCode?qt="+treQt+"&text="+text;
           this.setState({
                href:href,
                visible:true
           })
       }
       getAbsoluteUrl(shorturl){
           if(shorturl.indexOf("http://") == 0 || shorturl.indexOf("https://") == 0){
                return shorturl
           }
           let html=`
               <a href=${shorturl}></a>
            `
            var newEle = document.createElement("div");
            newEle.innerHTML=html;
            let aa=newEle.getElementsByTagName("a")[0];
            let hf=aa.href;
            return hf;
       }
       shareDrawer(){
            this.setState({
                 visible:false
            })
       }
       render(){
           return(
             <div className="CONTAINER">
                   <div className='purContent' ref='detail' onScroll={this.scroll.bind(this)}>
                   <Spin spinning={this.state.loading} tip="正在加载中">
                    <div className="pdpd_info">
                        <Carousel>
                             {this.state.swiperImg.map((item)=>(
                                  <div>
                                       <img src={item.IMG_PATH} />
                                  </div>
                             ))}
                        </Carousel>
                        <span className="Pd_detail" onClick={this.detail.bind(this)}>产品详情</span>
                    </div>
                    <div className="custom">
                            <p className="pdpd_name">{this.state.pdpd_info.GOODS_DESC}</p>
                          <p className="pdpd_price">
                               <span className='pdpd_priceNew'>￥{this.state.pdpd_info.FACE_AMT}</span>/{this.state.pdpd_info.UNIT}
                               {this.state.pdpd_info.FACE_AMT==this.state.pdpd_info.PRICE?(<Fragment></Fragment>):(<span className="pdpd_info_price_old">￥{this.state.pdpd_info.PRICE/this.state.pdpd_info.UNIT}</span>)}
                               <span class="pdpd_info_age">
                                  适用 : <span>{this.state.pdpd_info.INTRO }</span>
                              </span>
                          </p> 
                    </div>
                    {this.state.hotline.length>0?(
                                        <div className="weui-cells mt0">
                                             <a href={'tel:'+this.state.hotline[0].HOTLINE} className="weui-cell weui-cell_access weui-cell_link">
                                                 <div class="weui-cell__bd">联系客服</div>
                                                 <span class="weui-cell__ft">{this.state.hotline[0].LNK_CONTENT}</span>
                                             </a>
                                        </div>
                    ):(<Fragment></Fragment>)}
                    <div className="weui-cells product_limit mt0">
                          <div className="product_limit">
                               {this.state.bfbf_info.map((item)=>(
                                    <Row>
                                         <Col span={5}>{item.BFBF_NAME}</Col>
                                         <Col span={12}>{item.LIMIT_DESC}</Col>
                                         <Col span={7}>{item.OUT_LIMIT_DESC}</Col>
                                    </Row>
                               ))}
                          </div>
                    </div>
                     <div className='weui-tab' id={'tab'} ref='tab'>
                          <div  className={this.state.bar}>
                            {this.state.anchor.map((item,index)=>(
                                 <a href='javascript:;' className="weui-navbar__item" onClick={this.tabItem.bind(this,index)}>{item.title}</a>
                            ))}
                          </div>
                          <div className='weui-tab__panel'>
                           {this.state.hot_info.length==0?(<Fragment></Fragment>):(
                              <div id='a1' className="item">
                                   {this.state.hot_info.map((item)=>(
                                        <img src={item._HTML} />
                                   ))}
                             </div>
                           )}
                           {this.state.content_info.length==0?(<Fragment></Fragment>):(
                              <div id='a2' className="item">
                                   {this.state.content_info.map((item)=>(
                                         <img src={item._HTML} />
                                    ))}
                              </div>
                           )}
                          {this.state.flow_info.length==0?(<Fragment></Fragment>):(
                           <div id='a3' className="item">
                             {this.state.flow_info.map((item)=>(
                                   <img src={item._HTML} />
                              ))}
                           </div>
                          )}

                         <div id="a4" className="item">111</div>
                      </div>
                     </div>
                     </Spin>
                    </div>
                    <div className="bottom_btn_bg weui-flex">
                          <div className="weui-flex__item bottom_btn_left" onClick={this.share.bind(this)}>分享</div>
                          <div className="weui-flex__item back" onClick={()=>this.props.back()}>返回</div>
                    </div>
                    <Drawer width="100%" height="100%" visible={this.state.visible} className="zmage" closable={false} onClick={this.shareDrawer.bind(this)} placement="left">
                        <img src={this.state.href} />
                    </Drawer>
             </div>
           )
       }
}

export default ProductDetail