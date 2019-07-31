import React,{ Component,Fragment } from 'react';
import { Drawer } from 'antd';
import './scss/chat.scss';
import Chat from './pages/chatroom'
import ProductDetail from './pages/productDetail';

class App extends Component {
   constructor(prop){
       super(prop)
       this.state={
          chatroom:true, //聊天室开关
          className:"chatIndex", // 聊天室的大class
          chatZIndex:10,
          productDetail:false,//产品详情开关
          productDetailclass:"purchase",
          productDetailZIndex:1,
          zIndex:10,
         
       }
   }
  componentDidMount(){
  }
  productDetail(){
    let zIndex=this.state.zIndex
      this.setState({
          productDetailZIndex:zIndex+1,
          zIndex:zIndex+1,
          productDetail:true
      })
  }
  back(){
      let zIndex=this.state.zIndex;
      this.setState({
         chatZIndex:zIndex+1,
         zIndex:zIndex+1
      })
  }
  render(){
    return (
       <Fragment>
            <Drawer width="100%" height="100%" visible={this.state.chatroom} closable={false} className={this.state.className} zIndex={this.state.chatZIndex}>
                  <Chat productDetail={()=>this.productDetail()}></Chat>
            </Drawer>
            <Drawer width="100%" height="100%" visible={this.state.productDetail}  closable={false} className={this.state.productDetailclass} zIndex={this.state.productDetailZIndex}>
                   <ProductDetail back={()=>this.back()}></ProductDetail>
            </Drawer>
       </Fragment>
    );
  }

}

export default App;
