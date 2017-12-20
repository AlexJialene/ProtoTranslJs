🍌protocol translate js client tool

主要针对websocket的进制消息进行`打包`/`解包`。以及自动映射到对应的function处理逻辑的工具。

> [prototransl 详情（java语言）](https://github.com/AlexJialene/prototransl)
---
基本构造：
* protocol_translate.js
* pack.js
* unpack.js
* transl_protocol.json

## quick start

### `transl_protocol.json`

下载本项目根目录`protocol_translate.js`到你的项目，在与`protocol_translate.js`相同的目录下创建`transl_protocol.json`文件，
编写json内容：

* type : 协议号
* funName : 协议function名
* serviceName : 你需要处理逻辑的function名

```
[{
    "type": "1",
    "funName": "proto1",
    "serviceName": "proto1Service"
}, {
    "type": "2",
    "funName": "proto2",
    "serviceName": "proto2Service"
}, {
    "type": "3",
    "funName": "proto3",
    "serviceName": "proto3Service"
}]
```

### `UnpackProtocol`

你需要配置你的协议function载体,这样将自动解包并执行到你的serviceName：

```
<!--协议载体-->
function proto1(tempBuff) {
	<!--协议号-->
    var mType = 1; 
    <!--解包-->
    var str = tempBuff.ReadString() 
    var uint8 = tempBuff.ReadUint8()
    var uint16 = tempBuff.ReadUint16()
    this.mType = function() {
        return mType;
    }
    this.str = function() {
        return str;
    }
    this.uint8 = function() {
        return uint8;
    }
    this.uint16 = function() {
        return uint16;
    }
    // body...
}
```
协议function必须且带唯一的参数：`tempBuff` , tempBuff 提供如下方法

* ReadBoolean() //返回boolean
* ReadUint8()   //返回Uint8
* ReadUint16()  //返回Uint16
* ReadUint32()  //返回Uint32
* ReadUint64()  //返回Uint64
* ReadString()  //返回String

### `PackProtocol`

协议载体的打包需要你手动打包，代码如下：

```

var proto = new PackProtocol(1) // 1: mtype 
proto.pushString("什么")
proto.pushUint8(1);
proto.pushUint16(2);

proto.buffer(); // 返回arraybuffer
```








