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