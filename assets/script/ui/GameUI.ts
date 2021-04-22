import { _decorator, Component, Node, LabelComponent, SpriteComponent, SpriteFrame, loader, AnimationComponent } from 'cc';
import { RunTimeData } from '../data/GameData';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
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
        type:SpriteComponent,
        displayOrder:11,
    })
    avatar:SpriteComponent = null;

    @property({
        type:LabelComponent,
        displayOrder:12,
    })
    content:LabelComponent = null;

    @property({
        type:Node,
        displayOrder:13,
    })
    talkNode:Node = null;

    @property({
        type:Node,
        displayOrder:14,
    })
    guideNode:Node = null;

    private runtimeData=null;

    public show(){
        CustomEventListener.on(Constants.EventName.GREETING,this.greeting,this);
        CustomEventListener.on(Constants.EventName.GOODBYE,this.taking,this);
        CustomEventListener.on(Constants.EventName.SHOWTALK,this.talking,this);
        CustomEventListener.on(Constants.EventName.SHOWGUIDE,this.showGuide,this);

        this.runtimeData = RunTimeData.instance();
        this.refreshUI();
        this.showGuide(true);
    }

    private greeting(){
        const p=this.progress[this.runtimeData.maxProgress-1-this.runtimeData.currProgress];
        if(p){
            p.spriteFrame = this.progress2;
        }
    }

    private taking(){
        const p=this.progress[this.runtimeData.maxProgress-this.runtimeData.currProgress];
        if(p){
            p.spriteFrame = this.progress1;    
        }
        if(this.runtimeData.maxProgress===this.runtimeData.currProgress){
            this.targetSP.spriteFrame = this.LevelFinished;
        }
    }

    private talking(customerID:string){
        const index = Math.floor(Math.random()*Constants.talkTable.length);
        const str = Constants.talkTable[index];
        this.content.string = str;
        this.talkNode.active = true;
        const path=`texture/head/head${customerID+1}/spriteFrame`;
        loader.loadRes(path,SpriteFrame,(err:any,sp:SpriteFrame)=>{
            if(err){
                console.warn(err);
                return;
            }
            if(this.talkNode.active){
                this.avatar.spriteFrame=sp;
            }
        })
        this.scheduleOnce(()=>{
            this.talkNode.active = false;
        },1.5);
    }

    private showGuide(isShow:boolean){
        this.guideNode.active = isShow;
        if(isShow){
            const animcomp=this.guideNode.getComponent(AnimationComponent);
            animcomp.play("showguide");
        }
    }

    public hide(){
        CustomEventListener.off(Constants.EventName.GREETING,this.greeting,this);
        CustomEventListener.off(Constants.EventName.GOODBYE,this.taking,this);
        CustomEventListener.off(Constants.EventName.SHOWTALK,this.talking,this);
        CustomEventListener.off(Constants.EventName.SHOWGUIDE,this.showGuide,this);
    }

    private refreshUI()
    {
        for(let i=0;i<this.progress.length;i++){
            const elem=this.progress[i];
            if(i>=this.runtimeData.maxProgress){
                elem.node.active = false;
            }else
            {
                elem.node.active = true;
                elem.spriteFrame = this.progress3;
            }
        }
        this.srcLevel.string = `${this.runtimeData.currLevel}`;
        this.targetLevel.string = `${this.runtimeData.currLevel+1}`;
        this.srcSP.spriteFrame = this.LevelFinished;
        this.targetSP.spriteFrame = this.LevelUnFinished;
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
