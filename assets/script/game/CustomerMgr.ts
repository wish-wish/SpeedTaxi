import { _decorator, Component, Node, Vec3, AnimationComponent } from 'cc';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
import { AudioMgr } from './AudioMgr';
import { RunTimeData } from '../data/GameData';
const { ccclass, property } = _decorator;

const EventName = Constants.EventName;
const tempVec=new Vec3;

@ccclass('CustomerMgr')
export class CustomerMgr extends Component {
    @property({
        type:[Node],
    })
    customers:Node[]=[];

    @property
    walkTime=1;

    private currCustomer:Node = null as any;
    private startPos=new Vec3();
    private endPos=new Vec3();
    private InTheOrder=false;
    private deltaTime=0;
    private state = Constants.CustomerState.NONE;
    private customerID = -1;

    start () {
        // Your initialization goes here.
        CustomEventListener.on(EventName.GREETING,this.greetingCustomer,this);
        CustomEventListener.on(EventName.GOODBYE,this.goodbyeCustomer,this);
    }

    public update(dt:number)
    {
        if(this.InTheOrder)
        {
            this.deltaTime+=dt;
            if(this.deltaTime<this.walkTime){
                Vec3.lerp(tempVec,this.startPos,this.endPos,this.deltaTime/this.walkTime);
                this.currCustomer.setWorldPosition(tempVec);
            }else{
                this.deltaTime=0;
                this.InTheOrder=false;
                this.currCustomer.active=false;
                if(this.state===Constants.CustomerState.GOODBYE)
                {
                    this.currCustomer = null as any;
                }
                if(this.state==Constants.CustomerState.GREETING)
                {
                    AudioMgr.playSound(Constants.AudioFiles.INCAR);
                }
                CustomEventListener.dispatchEvent(EventName.FINISHEDWALK);
                CustomEventListener.dispatchEvent(Constants.EventName.SHOWGUIDE,true);
            }
        }
    }

    private greetingCustomer(...args:any[])
    {
        const cusidx=Math.floor(Math.random()*this.customers.length);
        this.customerID=cusidx;
        this.currCustomer=this.customers[cusidx];
        this.state = Constants.CustomerState.GREETING;
        if(!this.currCustomer){return;}
        this.InTheOrder=true;
        const carPos=args[0];
        const direction=args[1];
        Vec3.multiplyScalar(this.startPos,direction,1.4);
        this.startPos.add(carPos);
        Vec3.multiplyScalar(this.endPos,direction,0.5);
        this.endPos.add(carPos);

        this.currCustomer.setWorldPosition(this.startPos);
        this.currCustomer.active = true;

        if(direction.x!==0){
            if(direction.x>0){
                this.currCustomer.eulerAngles = new Vec3(0,-90,0);
            }
            else
            {
                this.currCustomer.eulerAngles = new Vec3(0,90,0);
            }
        }else
        {
            if(direction.z>0){
                this.currCustomer.eulerAngles = new Vec3(0,180,0);
            }
        }    
        
        const animComp = this.currCustomer.getComponent(AnimationComponent);
        animComp?.play("walk");

        CustomEventListener.dispatchEvent(Constants.EventName.SHOWTALK,cusidx);
        AudioMgr.playSound(Constants.AudioFiles.NEWORDER);
    }

    private goodbyeCustomer(...args:any[])
    {
        this.state = Constants.CustomerState.GOODBYE;
        this.InTheOrder=true;
        const carPos=args[0];
        const direction=args[1];
        Vec3.multiplyScalar(this.startPos,direction,0.5);
        this.startPos.add(carPos);
        Vec3.multiplyScalar(this.endPos,direction,1.4);
        this.endPos.add(carPos);

        this.currCustomer.setWorldPosition(this.startPos);
        this.currCustomer.active = true;

        const money = 30 + (RunTimeData.instance().currLevel/2) + (Math.random()*10);
        RunTimeData.instance().money += Math.floor(money);

        if(direction.x!==0){
            if(direction.x>0){
                this.currCustomer.eulerAngles = new Vec3(0,90,0);
            }
            else
            {
                this.currCustomer.eulerAngles = new Vec3(0,-90,0);
            }
        }else
        {
            if(direction.z<0){
                this.currCustomer.eulerAngles = new Vec3(0,180,0);
            }
        }    
        
        const animComp = this.currCustomer.getComponent(AnimationComponent);
        animComp?.play("walk");

        AudioMgr.playSound(Constants.AudioFiles.GETMONEY);
        CustomEventListener.dispatchEvent(Constants.EventName.SHOWTALK,this.customerID);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
