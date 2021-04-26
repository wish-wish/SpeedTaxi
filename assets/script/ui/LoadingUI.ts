import { _decorator, Component, Node, } from 'cc';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
import { UpdateLabelValue } from '../data/UpdateLabelValue';
const { ccclass, property } = _decorator;

@ccclass('LoadingUI')
export class LoadingUI extends Component {
    @property({
        type:UpdateLabelValue
    })
    progressLabel:UpdateLabelValue = null as any;


    private progress=0;

    public onEnable(){
        CustomEventListener.on(Constants.EventName.UPDATEPROGRESS,this.updateProgress,this);
    }

    public onDisable(){
        CustomEventListener.off(Constants.EventName.UPDATEPROGRESS,this.updateProgress,this);
    }

    public show(){
        this.node.active = true;
        this.progress = 50;
        //this.progressLabel.string=`${this.progress}`
        this.progressLabel.playUpdateValue(this.progress,this.progress,0);
    }

    public hide(){
        this.node.active = false;
    }

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        // Your update function goes here.
    }

    public updateProgress(value:number){
        //this.progressLabel.string=`${this.progress}`
        this.progressLabel.playUpdateValue(this.progress,this.progress+value,0.2);
        this.progress+=value;
    }

    public finishLoading(){
        this.progressLabel.playUpdateValue(this.progress,100,0.2);
        this.progress = 100;
        //this.progressLabel.string=`${this.progress}`
        this.scheduleOnce(this.close,0.3);
    }

    public close(){
        this.node.active = false;
    }
}
