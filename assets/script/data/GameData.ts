import { _decorator, Component, Node, ConstantForce, Vec3,ParticleSystemComponent, BoxColliderComponent, RigidBodyComponent, } from 'cc';
import { ConfigMgr } from './ConfigMgr';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('RunTimeData')
export class RunTimeData {
    public playerData:PlayerData = null as any;
    static _instance:RunTimeData = null as any;
    public static instance(){
        if(!this._instance){
            this._instance = new RunTimeData();
        }
        return this._instance;
    }

    constructor(){
        this.playerData = PlayerData.instance();
    }

    public currProgress:number = 0;
    public maxProgress:number = 0;
    public money:number = 0;
    public interval:number=0;
    public isTakeOver = true;
    get currLevel(){
        return this.playerData.playerIno.level;
    }
    get totalMoney(){
        return this.playerData.playerIno.money;
    }
}

export interface IPLayerInfo{
    money:number,
    level:number,    
    cameraPos:Vec3,
    cameraRotation:number,    
}

@ccclass('PlayerData')
export class PlayerData {

    public playerIno:IPLayerInfo = {money:0,level:1,cameraPos:new Vec3(0.012,5.267,13.121),cameraRotation:-79};
    public rigidbodys:Array<RigidBodyComponent>=[];
    public iscollider:boolean=false;    

    static _instance:PlayerData;

    public static instance(){
        if(!this._instance){
            this._instance = new PlayerData();
        }
        return this._instance;
    }

    public loadFormCache(){
        const info = ConfigMgr.instance().getConfigData(Constants.PlayerConfigID);
        if(info){
            this.playerIno = JSON.parse(info);
        }
    }

    public passLevel(rewarMoney:number){
        this.playerIno.level++;
        this.playerIno.money+=rewarMoney;
        this.savePlayerInfoToCache();
    }

    public earnMoney(rewarMoney:number){
        this.playerIno.money+=rewarMoney;
        this.savePlayerInfoToCache();
    }

    public savePlayerInfoToCache(){
        const data = JSON.stringify(this.playerIno);
        ConfigMgr.instance().setConfigData(Constants.PlayerConfigID,data);
    }
}