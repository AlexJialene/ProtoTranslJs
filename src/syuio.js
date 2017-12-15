document.write(" <script language=\"javascript\" src='pack/pack.js' > <\/script>");
document.write(" <script language=\"javascript\" src='pack/unpack.js' > <\/script>");
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
    //this to unpack and reflex service
    reflex(tempProtocol);
};

