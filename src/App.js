import React,{ Component,Fragment } from 'react';
import { Drawer } from 'antd';
import './scss/chat.scss';
import Chat from './pages/chatroom'
import productDetail from './pages/productDetail';
import server from './services/extendApi.js';
import ProductDetail from './pages/productDetail';
let api=new server()
class App extends Component {
   constructor(prop){
       super(prop)
       this.state={
          chatroom:true, //聊天室开关
          className:"chatIndex", // 聊天室的大class
          chatZIndex:1000,
          productDetail:false,//产品详情开关
          productDetailclass:"purchase",
          productDetailZIndex:1,
         
       }
   }
  componentDidMount(){
  }
  productDetail(){
      this.setState({
          chatZIndex:1,
          productDetailZIndex:1000,
          productDetail:true
      })
  }
  render(){
    return (
       <Fragment>
            <Drawer width="100%" height="100%" visible={this.state.chatroom} closable={false} className={this.state.className} zIndex={this.state.chatZIndex}>
                  <Chat productDetail={()=>this.productDetail()}></Chat>
            </Drawer>
            <Drawer width="100%" height="100%" visible={this.state.productDetail} closable={false} className={this.state.productDetailclass} zIndex={this.state.productDetailZIndex}>
                   <ProductDetail></ProductDetail>
            </Drawer>
       </Fragment>
    );
  }

}

export default App;
