import { _decorator, Component, Node, SpriteFrame, LabelComponent, SpriteComponent, ConstantForce } from 'cc';
import { RunTimeData, PlayerData } from '../data/GameData';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
const { ccclass, property } = _decorator;

@ccclass('ResultUI')
export class ResultUI extends Component {
    @property({
        type:LabelComponent,
        displayOrder:1,
    })
    targetLevel:LabelComponent = null;

    @property({
        type:LabelComponent,
        displayOrder:2,
    })
    srcLevel:LabelComponent = null;

    @property({
        type:SpriteComponent,
        displayOrder:3,
    })
    targetSP:SpriteComponent = null;

    @property({
        type:SpriteComponent,
        displayOrder:4,
    })
    srcSP:SpriteComponent = null;

    @property({
        type:SpriteFrame,
        displayOrder:5,
    })
    LevelFinished:SpriteFrame = null;

    @property({
        type:SpriteFrame,
        displayOrder:6,
    })
    LevelUnFinished:SpriteFrame = null;

    @property({
        type:[SpriteComponent],
        displayOrder:7,
    })
    progress:SpriteComponent[] = [];

    @property({
        type:SpriteFrame,
        displayOrder:8,
    })
    progress1:SpriteFrame = null;

    @property({
        type:SpriteFrame,
        displayOrder:9,
    })
    progress2:SpriteFrame = null;

    @property({
        type:SpriteFrame,
        displayOrder:10,
    })
    progress3:SpriteFrame = null;

    @property({
        type:LabelComponent,
        displayOrder:11,
    })
    progressLabel:LabelComponent = null;

    @property({
        type:LabelComponent,
        displayOrder:12,
    })
    moneyLabel:LabelComponent = null;


    public show(){
        const runtimeData=RunTimeData.instance();
        const maxProgress=runtimeData.maxProgress;
        const currProgress=runtimeData.currProgress;
        let index=0;
        for(let i=0;i<this.progress.length;i++){
            const elem=this.progress[i];
            if(i>=maxProgress){
                elem.node.active = false;
            }else
            {
                elem.node.active = true;
                //elem.spriteFrame = this.progress3;
                index = maxProgress - 1 - i;
                if(index>=currProgress){
                    //elem.spriteFrame = (index===currProgress&&!runtimeData.isTakeOver)?this.progress2:this.progress3;//当前进行中，否则未开始

                    const sp=(index === currProgress && !runtimeData.isTakeOver) ? this.progress2 : this.progress3;
                    elem.spriteFrame = sp;
                }else
                {
                    elem.spriteFrame = this.progress1;
                }
            }
        }
        this.srcSP.spriteFrame = this.LevelFinished;
        this.targetSP.spriteFrame = currProgress===maxProgress?this.LevelFinished:this.LevelUnFinished;
        this.progressLabel.string = `你完成了${currProgress}个订单`;
        this.srcLevel.string = `${runtimeData.currLevel}`;
        this.targetLevel.string = `${runtimeData.currLevel+1}`;
        this.moneyLabel.string = `${runtimeData.money}`;
    }

    public hide(){

    }

    public clickBtnNormal()
    {
        if(RunTimeData.instance().currProgress===RunTimeData.instance().maxProgress){
            PlayerData.instance().passLevel(RunTimeData.instance().money);
        }else
        {
            PlayerData.instance().earnMoney(RunTimeData.instance().money);
        }
        CustomEventListener.dispatchEvent(Constants.EventName.NEWLEVEL);
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
