import { _decorator, Component, Node, Prefab, ParticleUtils, ParticleSystemComponent, instantiate } from 'cc';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
import { PoolMgr } from '../data/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('EffectMgr')
export class EffectMgr extends Component {
    @property({
        type:Prefab
    })
    breakTrail:Prefab = null;

    @property({
        type:Prefab
    })
    coin:Prefab = null;

    private followTarget:Node = null;
    private currBreaking:Node= null;
    private coinparticle:ParticleSystemComponent;

    public start () {
        // Your initialization goes here.
        CustomEventListener.on(Constants.EventName.STARTBREAKING,this.startBreaking,this);
        CustomEventListener.on(Constants.EventName.ENDBREAKING,this.endBreaking,this);
        CustomEventListener.on(Constants.EventName.SHOWCOIN,this.showCoin,this);
    }

    public update(dt:number){
        if(this.currBreaking&&this.followTarget){
            this.currBreaking.setWorldPosition(this.followTarget.worldPosition)
        }
    }

    private startBreaking(...args:any[])
    {
        const follow = this.followTarget = args[0];
        this.currBreaking = PoolMgr.getNode(this.breakTrail,this.node);
        this.currBreaking.setWorldPosition(follow.worldPosition);
        ParticleUtils.play(this.currBreaking);
    }

    private endBreaking()
    {
        const currBreaking=this.currBreaking;
        ParticleUtils.stop(currBreaking);
        this.unscheduleAllCallbacks();
        this.scheduleOnce(()=>{
            PoolMgr.setNode(currBreaking);
        },2)
        this.currBreaking=null;
        this.followTarget=null;
    }

    private showCoin(...args:any[])
    {
        const pos=args[0];
        if(!this.coinparticle){
            const coin = instantiate(this.coin) as Node;
            coin.setParent(this.node);
            this.coinparticle=coin.getComponent(ParticleSystemComponent);
        }
        this.coinparticle.node.setWorldPosition(pos);
        this.coinparticle.play();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
