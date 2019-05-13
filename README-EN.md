🍌protocol translate js client tool

Mainly for the websocket binary message to `package` / `unpacking`. And tools that automatically map to the corresponding function processing logic.

> [prototransl （java version）](https://github.com/AlexJialene/prototransl)

Basic structure:

* protocol_translate.js
* pack.js
* unpack.js
* transl_protocol.json

## quick start

### `transl_protocol.json`

Download the project root directory `protocol translate.js` to your project. Create a `transl_protocol.json` file in the same directory as `protocol_translate.js`.

Write json file content：

* type : Protocol number
* funName : function name
* serviceName : You need to handle the function name of the logic

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

You need to configure your protocol carrier so that it will be automatically unpacked and executed to your serviceName:

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

The method must have a unique argument: `temp Buff` , temp Buff provides the following method

* ReadBoolean() //boolean
* ReadUint8()   //Uint8
* ReadUint16()  //Uint16
* ReadUint32()  //Uint32
* ReadUint64()  //Uint64
* ReadString()  //String

### `PackProtocol`

You need to manually package

```
var proto = new PackProtocol(1) // 1: mtype 
proto.pushString("wtf")
proto.pushUint8(1);
proto.pushUint16(2);

proto.buffer(); // arraybuffer
```
