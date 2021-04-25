// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SocketModule')
export class SocketModule extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    socket:WebSocket=new WebSocket("ws://127.0.0.1:7681");        

    start () {
        // Your initialization goes here.
        this.initSocket();
    }

    initSocket() {
        var that = this;
        //that.socket = new WebSocket("ws://echo.websocket.org");        
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = function(evt) {
            console.log("onopen");
        };
        this.socket.onmessage = function(evt) {
            //that.parseArrayObject(evt);
            var array = new Uint16Array(evt.data);
            var str = "";
            for (var i = 0; i < array.length; i++) {
                str = str + String.fromCharCode(array[i]);
            }
            console.log("recv:"+str);
            //that.label.string = str;
        };
        this.socket.onerror = function(evt) {
            console.log("onerror:");
        };
        this.socket.onclose = function(evt) {
            console.log("closed");            
        };
        this.scheduleOnce(function() {
            var data = "Hello WS中文,Binary,\0";
            that.sendStr(data);
        }, 1.0);
    }

    sendStr(datastr:any) {
        if (!this.socket) { return; }
        if (this.socket.readyState === WebSocket.OPEN) {
            console.log("send:"+datastr.length + ":" + datastr);
            var arrData = new Uint16Array(datastr.length);
            for (var i = 0; i < datastr.length; i++) {
                arrData[i] = datastr.charCodeAt(i);
            }
            //console.log("arrdata:" + arrData);
            this.socket.send(arrData);
        } else {
            var warningStr = "send binary websocket instance wasn't ready...";
            console.log(warningStr);
            this.scheduleOnce(function() {
                //this.sendata();
            }, 2);
        }
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
