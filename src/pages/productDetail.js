import React ,{ Component,Fragment } from 'react';
import '../scss/productDetail.scss'
import {Carousel,Spin} from 'antd'
import server from "../services/extendApi";
let api=new server()

class ProductDetail extends Component{
       constructor(props){
           super(props)
          this.state={
               loading:true,
               swiperImg:[],

          }
       }
       componentDidMount(){
             this.load();
       }
       load(){
          api.sendPost("../post_policy_product/get_policy_product_html").then(res=>{
              let data=res.data;
                this.setState({
                     loading:false,
                     swiperImg:data.detail_swiper,
                     pdpd_info:data.pdpd_info,
                })
          })
       }
       render(){
           return(
             <div className="CONTAINER">
                 <Spin spinning={this.state.loading} tip="正在加载中">
                    <div className="pdpd_info">
                        <Carousel>
                             {this.state.swiperImg.map((item)=>(
                                  <div>
                                       <img src={item.IMG_PATH} />
                                  </div>
                             ))}
                        </Carousel>
                        <span className="Pd_detail">产品详情</span>
                    </div>
                    <div className="custom">
                          <p className="pdpd_name">{this.state.pdpd_info.GOODS_DESC}</p>
                          <p className="pdpd_price">
                               <span className='pdpd_priceNew'>￥{this.state.pdpd_info.FACE_AMT}</span>/{this.state.pdpd_info.UNIT}
                               
                          </p>
                    </div>
                 </Spin>
             </div>
           )
       }
}

export default ProductDetail