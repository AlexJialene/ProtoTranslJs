document.write(" <script language=\"javascript\" src='pack/pack.js' > <\/script>");
document.write(" <script language=\"javascript\" src='pack/unpack.js' > <\/script>");
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