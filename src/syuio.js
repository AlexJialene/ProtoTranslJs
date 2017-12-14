var dataLen = 0;
var currentLen = 0;
var receiveBuff;
var packLen = 512;
function receive(eventdata) {
    var dataView = new DataView(eventdata);
    for (var i = 0; i < dataView.byteLength; i++) {
        if (dataLen <= 0) {
            dataLen = dataView.getUint8(0 + i) * 256 + dataView.getUint8(1 + i) + 2;
            var tempBuff = new ArrayBuffer(dataLen);
            receiveBuff = new Uint8Array(tempBuff);
            currentLen = 0;
            if (dataLen <= 2) {
                dataLen = 0;
                currentLen = 0
                return
            }
        }
        receiveBuff[currentLen++] = dataView.getUint8(i);
        if (currentLen >= dataLen) {
            receiveData(receiveBuff);
            dataLen = 0
            currentLen = 0
        }
    }

}

function receiveData(receiveBuff) {
    if (receiveBuff.byteLength == 0) {
        return false;
    }
    var tempProtocol = new UnpackProtocol(receiveBuff, receiveBuff.byteLength);
    var tempDataLen = tempProtocol.ReadUint16();
    reflex(tempProtocol);
};

function UnpackProtocol(data, size) {
    var mBuffer = new Uint8Array(size);
    var buffer;
    var mBufferLen;
    var mPos = 0;
    for (var i = 0; i < mBuffer.length; i++) {
        mBuffer[i] = data[i];
    }
    //mBufferLen = size;
    this.ReadBoolean = function () {
        var val = this.ReadUint8();
        if (1 == val)
            return true;
        return false;
    }
    this.ReadUint8 = function () {
        var var1 = 0;
        var temp = mPos;
        for (var i = temp; i < temp + 1 && i < mBuffer.length; i++) {
            var1 += mBuffer[i];
            mPos++;
        }
        return var1;
    }

    this.ReadUint16 = function () {
        var var1 = 0;
        var temp = mPos;
        for (var i = temp; i < temp + 2 && i < mBuffer.length; i++) {
            var1 = var1 * 256 + mBuffer[i];
            mPos++;
        }
        return var1;
    }

    this.ReadUint32 = function () {
        var var1 = 0;
        var temp = mPos;
        for (var i = temp; i < temp + 4 && i < mBuffer.length; i++) {
            var1 = var1 * 256 + mBuffer[i];
            mPos++;
        }
        return var1;
    }

    this.ReadUint64 = function () {
        var var1 = 0;
        var temp = mPos;
        for (var i = temp; i < temp + 8 && i < mBuffer.length; i++) {
            var1 = var1 * 256 + mBuffer[i];
            mPos++;
        }
        return var1;
    }
    this.ReadString = function () {
        var uLen = this.ReadUint16();
        var temp = mPos;
        var str = "";
        str = new TextDecoder("utf-8").decode(mBuffer.subarray(temp, temp + uLen));
        mPos += uLen;
        return str.toString();
    }

    this.Data = function () {
        return mBuffer;
    }
}
