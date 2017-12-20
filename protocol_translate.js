var dataLen = 0;
var currentLen = 0;
var receiveBuff;
var packLen = 512;
var protoJsonPath = "./transl_protocol.json";
var auto_reflex_service = true;

function initProtoTransl(path, autoReflex) {
    // body...
    protoJsonPath = path;
    auto_reflex_service = autoReflex;
}

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
    tempProtocol.ReadUint16();
    reflex(tempProtocol);

    function reflex(tempProtocol) {
        var mType = tempProtocol.ReadUint16();
        $.get('syuio_protocol.json').done(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (mType == data[i].type) {
                    var fun = eval(data[i].funName);
                    if (auto_reflex_service) {
                        var service = eval(data[i].serviceName);
                        new service(new fun(tempProtocol));
                    } else {
                        return new fun(tempProtocol);
                    }
                }
            }
        });
    }
};

function proto1(tempBuff) {
    var mType = 1;
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

// max value of Integer
var MAX_VALUE = 0x7fffffff;

function PackProtocol(mType) {
    var mBuffer = new ArrayBuffer(packLen);
    var view = new DataView(mBuffer);
    var pos = 4; //init 4
    view.setUint16(2, mType);
    this.position = function () {
        return pos;
    }

    this.pushUint8 = function (var1) {
        autoExpand(1);
        view.setUint8(pos, var1);
        pos += 1;
    }
    this.pushUint16 = function (var1) {
        autoExpand(2);
        view.setUint16(pos, var1);
        pos += 2;
    }
    this.pushUint32 = function (var1) {
        autoExpand(4);
        view.setUint32(pos, var1);
        pos += 4;
    }
    this.pushUint64 = function (var1) {
        autoExpand(8);
        view.setFloat64(pos, var1);
        pos += 8;
    }
    this.pushString = function (str) {
        var uint8array = new TextEncoder().encode(str);

        autoExpand(uint8array.byteLength);

        view.setUint16(pos, uint8array.byteLength);
        pos += 2;
        for (var j = 0; j < uint8array.byteLength; j++) {
            view.setUint8(pos, uint8array[j]);
            pos += 1;
        }
    }

    this.buffer = function () {
        view.setUint16(0, pos);
        return mBuffer;
    }

    function autoExpand(len) {
        autoExpand(len, true);
    }

    function autoExpand(len, auto) {
        autoExpand(pos, len, auto);
    }

    function capacity(newCap) {
        if (newCap > mBuffer.byteLength) {
            var newBuff = new ArrayBuffer(newCap);
            var oldView = view;
            view = new DataView(newBuff);
            for (var i = 0; i <= pos; i++) {
                view.setUint8(i, oldView.getUint8(i));
            }

        }

    }

    function autoExpand(pos, len, auto) {
        var end = pos + len;
        var newCap;
        if (auto) {
            newCap = normalizeCap(end);
        } else {
            newCap = end;
        }
        if (newCap > mBuffer.byteLength) {
            capacity(newCap);
        }
    }
}

function normalizeCap(end) {
    if (0 > end) {
        return MAX_VALUE;
    }
    var newCap = highestOneBit(end);
    newCap <<= (newCap < end ? 1 : 0);
    return newCap < 0 ? MAX_VALUE : newCap;

    function highestOneBit(end) {
        end |= (end >> 1);
        end |= (end >> 2);
        end |= (end >> 4);
        end |= (end >> 8);
        end |= (end >> 16);
        return end - (end >>> 1);
    }
}

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