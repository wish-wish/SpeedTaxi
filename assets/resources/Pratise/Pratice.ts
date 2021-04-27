
import { _decorator, Component, Node, VideoPlayer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pratice')
export class Pratice extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({type:VideoPlayer})
    public videoPlayer=null;

    start () {
        // [3]
        const event=new Component.EventHandler();
        //event.target=this.node.target;
        event.Component='mycom';
        event.handler = "callcback";
        event.customEventData="food";
        this.videoPlayer.videoPlayerEvent.push(event);

        this.videoPlayer.node.on(VideoPlayer.EventType.READY_TO_PLAY,this.callback,this);
    }

    callback(videoplayer,eventType,customEventData)
    {
        console.log("callback:"+customEventData);
        this.videoPlayer.play();
    }

    public play(event,customEventData)
    {
        console.log(event.target.name);        
        console.log(customEventData);
        console.log("---------------------");
        this.videoPlayer.play();
    }
    
    
    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
