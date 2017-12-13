function PackProtocol() {
    var mBuffer = new ArrayBuffer(packLen);
    var buffLen = 0;
    this.size = function () {
        return mBuffer.buffer.length;
    }
    this.pushUint8 = function (var1) {
        var value = new Uint8Array(mBuffer , buffLen , 1);
        value[0] = var1;
        buffLen+=1;
    }
    this.pushUint16 = function (var1) {

        var v = new DataView(mBuffer);
        v.setUint16(0,2,false);
        v.setUint32(2,3,false);
        v.setUint8(6,4,false)

        var str = "你说什么"
        var buf = new ArrayBuffer(str.length*2);
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        var bufv = new DataView(buf);
        for (var j = 0 ; j <buf.byteLength ; j++){
            v.setUint8(j+7 , bufv.getUint8(j));
        }
        console.log(v.getUint16(0,false));
        console.log(v.getUint32(2,false));
        console.log(v.getUint8(6))


        console.log('----')
        for(var i = 0 ; i < v.buffer.byteLength ; i++){
            console.log(v.getUint8(i))
        }

    }


}
function PackDemo() {
    this.mType = 1;
    this.Pack = function (pack) {

    }
}