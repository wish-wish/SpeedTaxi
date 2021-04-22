import { _decorator, Component, Node, Vec3, ParticleSystemComponent, BoxColliderComponent, RigidBodyComponent, ICollisionEvent, ConstantForce } from 'cc';
import { RoadPoint } from './RoadPoint';
import { Constants } from '../data/Constants';
import { CustomEventListener } from '../data/CustomEventListener';
import { AudioMgr } from './AudioMgr';
import { RunTimeData } from '../data/GameData';
const { ccclass, property } = _decorator;

const tempVec = new Vec3();
const EventName = Constants.EventName;
const TOOTING_COOL_TIME=5;

enum RunState{
    NORMAL = 0,
    INORDER=1,
    CRASH=2,
    OVER=3,
}

@ccclass('Car')
export class Car extends Component {
    
    @property
    maxSpeed=0.2;

    @property
    minSpeed=0.002;

    private currRoadPoint:RoadPoint = null;
    private pointA = new Vec3();
    private pointB = new Vec3();
    private currSpeed = 0.2;
    private isMoving = false;
    private offset = new Vec3();
    private originRotation=0;
    private targetRotation=0;
    private centerPoint=new Vec3();
    private rotMeasure=0;
    private acceleration=0.1;
    private isMainCar=false;
    private isBreaking=false;
    private gas:ParticleSystemComponent=null;
    private light:Node;
    private moveOverCD:Function = null;
    private camera:Node = null;
    private toolingCoolTime=0;
    private _minSpeed = 0;
    private _maxSpeed = 0;
    private runState = RunState.NORMAL;

    update(dt:number){
        this.toolingCoolTime = this.toolingCoolTime>dt?this.toolingCoolTime-dt:0;
        if(!this.currRoadPoint||(!this.isMoving&&this.currSpeed<=0)||this.runState===RunState.INORDER||this.runState===RunState.CRASH){
            return;
        }
        //if(this.isMoving)
        {
            this.offset.set(this.node.worldPosition);
            this.currSpeed+=this.acceleration*dt;
            if(this.currSpeed>this._maxSpeed)
            {
                this.currSpeed=this._maxSpeed;
            }
            //if(this.acceleration<0&&this.currSpeed<=0.001){
            if(this.currSpeed<=0.001){
                this.currSpeed=this._minSpeed;
                if(this.isBreaking){
                    this.isBreaking=false;
                    CustomEventListener.dispatchEvent(EventName.ENDBREAKING);
                }
            }
            switch(this.currRoadPoint.moveType){
                case RoadPoint.RoadMoveType.CURVE:
                    const offsetRotation =this.targetRotation-this.originRotation;
                    const currntRotation=this.conversion(this.node.eulerAngles.y);
                    let nextStation=(currntRotation-this.originRotation)+(this.currSpeed*this.rotMeasure*(this.targetRotation>this.originRotation?1:-1));
                    if(Math.abs(nextStation)>Math.abs(offsetRotation)){
                        nextStation=offsetRotation;
                    }
                    let target = nextStation + this.originRotation;
                    tempVec.set(0,target,0);
                    this.node.eulerAngles=tempVec;

                    //const sin=Math.sin(nextStation*Math.PI/180);
                    //const cos=Math.cos(nextStation*Math.PI/180);
                    //const xlength = this.pointA.x-this.centerPoint.x;
                    //const zlength = this.pointA.z-this.centerPoint.z;
                    //this.offset.set(xlength*cos+zlength*sin+this.centerPoint.x,0,-xlength*sin+zlength*cos+this.centerPoint.z);

                    Vec3.rotateY(this.offset,this.pointA,this.centerPoint,nextStation*Math.PI/180);
                    break;
                default:
                    const z = this.pointB.z - this.pointA.z;
                    if(z!==0)
                    {
                        if(z>0){
                            this.offset.z += this.currSpeed;
                            if(this.offset.z>this.pointB.z)
                            {
                                this.offset.z=this.pointB.z;
                            }
                        }
                        else
                        {
                            this.offset.z -= this.currSpeed;
                            if(this.offset.z<this.pointB.z)
                            {
                                this.offset.z=this.pointB.z;
                            }
                        }
                            
                    }else
                    {
                        //console.log("xmove");
                        const x = this.pointB.x - this.pointA.x;
                        if(x>0){
                            this.offset.x += this.currSpeed;
                            if(this.offset.x>this.pointB.x)
                            {
                                this.offset.x=this.pointB.x;
                            }
                        }
                        else{
                            this.offset.x -= this.currSpeed;
                            if(this.offset.x<this.pointB.x)
                            {
                                this.offset.x=this.pointB.x;
                            }
                        }
                    }
                    break;
            }
            this.node.setWorldPosition(this.offset);
            Vec3.subtract(tempVec,this.pointB,this.offset);
            if(tempVec.length() <= 0.01){
                this.arrivalStation();
            }
        }
    }

    public startRunning(){
        if(this.runState!==RunState.NORMAL)
        {
            return;
        }
        this._minSpeed=this.minSpeed;
        this._maxSpeed=this.maxSpeed;
        if(this.currRoadPoint){
            this.isMoving = true;
            if(this.light){
                this.light.active=true;
            }
            if(this.gas){
                this.gas.play();
            }
            this.acceleration=0.2;
        }
        if(this.isBreaking){
            CustomEventListener.dispatchEvent(EventName.ENDBREAKING);
            this.isBreaking=false;
        }
    }

    public stopRunning(){
        if(this.runState!=RunState.NORMAL)
        {
            return;
        }
        this.acceleration=-0.2;
        // this.isMoving = false;
        if(this.currRoadPoint&&this.currRoadPoint.type!==RoadPoint.RoadPointType.END)
        {
            this.isBreaking=true;
            CustomEventListener.dispatchEvent(EventName.STARTBREAKING,this.node);
            AudioMgr.playSound(Constants.AudioFiles.STOP);
        }
    }

    public moveAfterFinished(cd:Function){
        this.moveOverCD=cd;
    }

    public tooting(){
        if(this.toolingCoolTime>0){
            return;
        }
        this.toolingCoolTime = TOOTING_COOL_TIME;
        const audioFile=Math.floor(Math.random()*2)<1?Constants.AudioFiles.TOOTING1:Constants.AudioFiles.TOOTING2;
        AudioMgr.playSound(audioFile);
    }

    public startWithMinSpeed(){
        this.currSpeed=this.minSpeed;
        this._maxSpeed = this.minSpeed;
        this.isMoving=true;
        
    }

    private arrivalStation(){
        if(!this.currRoadPoint.nextStation)
        {
            return;
        }
        this.pointA.set(this.pointB);
        this.currRoadPoint = this.currRoadPoint.nextStation.getComponent(RoadPoint);
        if(this.currRoadPoint.nextStation){
            this.pointB.set(this.currRoadPoint.nextStation.worldPosition);
            if(this.currRoadPoint.type!==RoadPoint.RoadPointType.END){
                if(this.isMainCar){
                    if(this.isBreaking){
                        this.isBreaking=false;
                        CustomEventListener.dispatchEvent(EventName.ENDBREAKING);
                    }
                    if(this.currRoadPoint.type===RoadPoint.RoadPointType.GREETING){
                        this.greetingCustomer();
                    }
                    else if(this.currRoadPoint.type===RoadPoint.RoadPointType.GOODBYE)
                    {
                        this.goodbyCustomer();
                    }
                }
                if(this.currRoadPoint.moveType===RoadPoint.RoadMoveType.CURVE)
                {
                    if(this.currRoadPoint.clockwise){
                        this.originRotation=this.conversion(this.node.eulerAngles.y);
                        this.targetRotation=this.originRotation-90;
                        if((this.pointB.z<this.pointA.z&&this.pointB.x>this.pointA.x)||
                            (this.pointB.z>this.pointA.z&&this.pointB.x<this.pointA.x))
                            {
                                this.centerPoint.set(this.pointB.x,0,this.pointA.z);
                            }
                        else{
                                this.centerPoint.set(this.pointA.x,0,this.pointB.z);
                            }
                    }
                    else
                    {
                        this.originRotation=this.conversion(this.node.eulerAngles.y);
                        this.targetRotation=this.originRotation+90;
                        if((this.pointB.z>this.pointA.z&&this.pointB.x>this.pointA.x)||
                            (this.pointB.z<this.pointA.z&&this.pointB.x<this.pointA.x))
                            {
                                this.centerPoint.set(this.pointB.x,0,this.pointA.z);
                            }
                        else{
                                this.centerPoint.set(this.pointA.x,0,this.pointB.z);
                            }
                    }
                    Vec3.subtract(tempVec,this.pointA,this.centerPoint);
                    const r=tempVec.length();
                    this.rotMeasure = 90/(Math.PI*r/2);
                }
            }
            else
            {
                // this.currRoadPoint=null;
                // this.isMoving=false;
                // if(this.gas){
                //     this.gas.stop();
                // }
                // if(this.light){
                //     this.light.active=false;
                // }            
                AudioMgr.playSound(Constants.AudioFiles.WIN);
                this.runState = RunState.OVER;
                CustomEventListener.dispatchEvent(Constants.EventName.GAMEOVER);
                this._minSpeed=this.maxSpeed=0.1;
                this.currSpeed=this._minSpeed;
                if(this.moveOverCD){
                    this.moveOverCD(this);
                    this.moveOverCD=null;
                }
            }
        }
    }

    private greetingCustomer()
    {
        const RD = RunTimeData.instance();
        RD.isTakeOver = false;

        this.runState = RunState.INORDER;
        this.currSpeed=0;
        this.isMoving=false;
        if(this.gas){
            this.gas.stop();
        }
        CustomEventListener.dispatchEvent(EventName.GREETING,this.node.worldPosition,this.currRoadPoint.direction);
    }

    private goodbyCustomer(){

        const RD = RunTimeData.instance();
        RD.isTakeOver = true;
        RD.currProgress ++;

        this.runState = RunState.INORDER;
        this.currSpeed=0;
        this.isMoving=false;
        if(this.gas){
            this.gas.stop();
        }
        CustomEventListener.dispatchEvent(EventName.GOODBYE,this.node.worldPosition,this.currRoadPoint.direction);
        CustomEventListener.dispatchEvent(EventName.SHOWCOIN,this.node.worldPosition);
    }


    private conversion(value:number){
        let a=value;
        if(a<0){
            a+=360;
        }
        return a;
    }

    public setEntry(entry:Node,isMain=false)
    {
        this.node.setWorldPosition(entry.worldPosition);
        this.isMainCar=isMain;
        
        this.currRoadPoint=entry.getComponent(RoadPoint);
        if(this.currRoadPoint===null)
        {
            console.warn("There is no RoadPoint in "+entry.name);
        }
        else
        {
            this.pointA.set(entry.worldPosition);
            this.pointB.set(this.currRoadPoint.nextStation.worldPosition);
            const zd=this.pointB.z-this.pointA.z;
            if(zd!==0)
            {
                if(zd<0){
                    this.node.eulerAngles=new Vec3();
                }else
                {
                    this.node.eulerAngles=new Vec3(0,180,0);
                }
            }else
            {
                const xd=this.pointB.x-this.pointA.x;
                if(xd>0)
                {
                    this.node.eulerAngles = new Vec3(0,270,0);
                }
                else
                {
                    this.node.eulerAngles = new Vec3(0,90,0);
                }
            }
        }
        this.runState = RunState.NORMAL;
        const collider = this.node.getComponent(BoxColliderComponent);
        const rigidbody = this.node.getComponent(RigidBodyComponent);
        this.currSpeed = 0;
        this.isMoving = false;

        if(this.isMainCar){
            const gasNode=this.node.getChildByName('gas');
            this.gas = gasNode.getComponent(ParticleSystemComponent);
            if(this.gas){
                this.gas.stop();
            }
            this.light = this.node.getChildByName('light');
            if(this.light){
                this.light.active=false;
            }
            collider.on('onCollisionEnter',this.onCollisionEnter,this)
            collider.setGroup(Constants.CarGroup.MAINCAR);
            collider.setMask(Constants.CarGroup.OTHERCAR);
        }else
        {
            collider.setGroup(Constants.CarGroup.OTHERCAR);
            collider.setMask(-1);//所有组都检测-1,所有组都不检测0
        }
        this.resetPhysical();
    }

    public setCamera(camera:Node,pos:Vec3,rotation:number){
        if(this.isMainCar){
            this.camera=camera;
            this.camera.parent=this.node;
            this.camera.setPosition(pos);
            this.camera.eulerAngles = new Vec3(rotation,0,0);
        }
    }


    private onCollisionEnter(event:ICollisionEvent){
        const otherCollider=event.otherCollider;
        if(otherCollider.node.name==="groundcollider"){
            return;
        }
        const otherRigidbody=otherCollider.node.getComponent(RigidBodyComponent);
        otherRigidbody.useGravity = true;
        otherRigidbody.applyForce(new Vec3(0,3000,-1500),new Vec3(0,0.5,0));

        const collider=event.selfCollider;
        collider.addMask(Constants.CarGroup.NORMAL);
        const rigidBody = this.node.getComponent(RigidBodyComponent);
        rigidBody.useGravity=true;
        this.runState = RunState.CRASH;
        AudioMgr.playSound(Constants.AudioFiles.CRASH);
        CustomEventListener.dispatchEvent(Constants.EventName.GAMEOVER);
    }


    public stopImmediately(){
        this.isMoving=false;
        this.currSpeed=0;
    }

    private resetPhysical(){
        const rigidBody = this.node.getComponent(RigidBodyComponent);
        rigidBody.useGravity = false;
        rigidBody.sleep();
        rigidBody.wakeUp();
    }

    start () {
        // Your initialization goes here.
        CustomEventListener.on(EventName.FINISHEDWALK,this.finishWalk,this)
        this._minSpeed=this.minSpeed;
        this._maxSpeed=this.maxSpeed;
    }

    private finishWalk()
    {
        if(this.isMainCar){
            this.runState = RunState.NORMAL;
            if(this.gas){
                this.gas.play();
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
