import { _decorator, Component, Node, LabelComponent, SpriteComponent, SpriteFrame, resources, AnimationComponent } from 'cc';
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
    targetLevel:LabelComponent = null as any;

    @property({
        type:LabelComponent,
        displayOrder:2,
    })
    srcLevel:LabelComponent = null as any;

    @property({
        type:SpriteComponent,
        displayOrder:3,
    })
    targetSP:SpriteComponent = null as any;

    @property({
        type:SpriteComponent,
        displayOrder:4,
    })
    srcSP:SpriteComponent = null as any;

    @property({
        type:SpriteFrame,
        displayOrder:5,
    })
    LevelFinished:SpriteFrame = null as any;

    @property({
        type:SpriteFrame,
        displayOrder:6,
    })
    LevelUnFinished:SpriteFrame = null as any;

    @property({
        type:[SpriteComponent],
        displayOrder:7,
    })
    progress:SpriteComponent[] = [];

    @property({
        type:SpriteFrame,
        displayOrder:8,
    })
    progress1:SpriteFrame = null as any;

    @property({
        type:SpriteFrame,
        displayOrder:9,
    })
    progress2:SpriteFrame = null as any;

    @property({
        type:SpriteFrame,
        displayOrder:10,
    })
    progress3:SpriteFrame = null as any;

    @property({
        type:SpriteComponent,
        displayOrder:11,
    })
    avatar:SpriteComponent = null as any;

    @property({
        type:LabelComponent,
        displayOrder:12,
    })
    content:LabelComponent = null as any;

    @property({
        type:Node,
        displayOrder:13,
    })
    talkNode:Node = null as any;

    @property({
        type:Node,
        displayOrder:14,
    })
    guideNode:Node = null as any;

    private runtimeData=null;

    public show(){
        CustomEventListener.on(Constants.EventName.GREETING,this.greeting,this);
        CustomEventListener.on(Constants.EventName.GOODBYE,this.taking,this);
        CustomEventListener.on(Constants.EventName.SHOWTALK,this.talking,this);
        CustomEventListener.on(Constants.EventName.SHOWGUIDE,this.showGuide,this);

        this.refreshUI();
        this.showGuide(true);
    }

    private greeting(){
        const p=this.progress[RunTimeData.instance().maxProgress-1-RunTimeData.instance().currProgress];
        if(p){
            p.spriteFrame = this.progress2;
        }
    }

    private taking(){
        const p=this.progress[RunTimeData.instance().maxProgress-RunTimeData.instance().currProgress];
        if(p){
            p.spriteFrame = this.progress1;    
        }
        if(RunTimeData.instance().maxProgress===RunTimeData.instance().currProgress){
            this.targetSP.spriteFrame = this.LevelFinished;
        }
    }

    private talking(customerID:string){
        const index = Math.floor(Math.random()*Constants.talkTable.length);
        const str = Constants.talkTable[index];
        this.content.string = str;
        this.talkNode.active = true;
        const path=`texture/head/head${customerID+1}/spriteFrame`;
        resources.load(path,SpriteFrame,(err:any,sp:SpriteFrame)=>{
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
            animcomp?.play("showguide");
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
            if(i>=RunTimeData.instance().maxProgress){
                elem.node.active = false;
            }else
            {
                elem.node.active = true;
                elem.spriteFrame = this.progress3;
            }
        }
        this.srcLevel.string = `${RunTimeData.instance().currLevel}`;
        this.targetLevel.string = `${RunTimeData.instance().currLevel+1}`;
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
