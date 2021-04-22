import { _decorator, Component, Node, LabelComponent, ConstantForce,sys } from 'cc';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
import { RunTimeData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {

    @property({
        type:LabelComponent
    })
    moneyLabel:LabelComponent = null;

    private clickTime = 0;
    private time = 0;

    public onEnable(){
        this.moneyLabel.string = `${RunTimeData.instance().totalMoney}`;
    }

    public clickStart(){
        CustomEventListener.dispatchEvent(Constants.EventName.GAMESTART);
    }

    public clickDebug(){
        const time = Date.now();
        if(time-this.time<=200){
            this.clickTime++;
        }else
        {
            this.clickTime = 0;
        }
        this.time = time;
        if(this.clickTime>3){
            
            sys.localStorage.removeItem(Constants.GameConfigID);
            this.clickTime = 0;
            console.log('clear cache');
        }
    }

    start () {
        // Your initialization goes here.
    }



    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
