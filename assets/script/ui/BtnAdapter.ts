import { _decorator, Component, Node, ButtonComponent } from 'cc';
import { AudioMgr } from '../game/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('BtnAdapter')
export class BtnAdapter extends Component {

    @property
    soundName='';

    @property
    delayTime=0;

    start () {
        this.node.on(ButtonComponent.EventType.CLICK,this.click,this);
    }

    click(){
        this.scheduleOnce(this.playSound,this.delayTime);
    }

    playSound(){
        if(this.soundName.length<=0){
            return;
        }
        AudioMgr.playSound(this.soundName);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
