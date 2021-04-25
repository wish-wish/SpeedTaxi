import { _decorator, Component, Node, EventTouch, BoxColliderComponent
    ,setDisplayStats, Vec3, resources, Prefab, instantiate } from 'cc';
import { MapMgr } from './MapMgr';
import { CarMgr } from './CarMgr';
import { AudioMgr } from './AudioMgr';
import { Constants } from '../data/Constants';
import { CustomEventListener } from '../data/CustomEventListener';
import { UIMgr } from '../ui/UIMgr';
import { RunTimeData, PlayerData } from '../data/GameData';
import { LoadingUI } from '../ui/LoadingUI';
import { ConfigMgr } from '../data/ConfigMgr';
import { PoolMgr } from '../data/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    @property({
        type:MapMgr,
    })
    mapMgr:MapMgr = null as any;

    @property({
        type:CarMgr,
    })
    carMgr:CarMgr = null as any;

    @property({
        type:Node,
    })
    group:Node = null as any;

    @property({
        type:LoadingUI
    })
    LoadingUI:LoadingUI = null as any;


    private progress=5;
    //private level=1;

    private runTimeData:RunTimeData = null  as any;


    public onLoad(){
        //this.reset();
        this.runTimeData = RunTimeData.instance();
        ConfigMgr.instance().init();
        PlayerData.instance().loadFormCache();
        this.loadMap();
        const collider=this.group.getComponent(BoxColliderComponent);
        collider?.setGroup(Constants.CarGroup.NORMAL);
        collider?.setMask(-1);
        setDisplayStats(false);
    }

    start () {

        UIMgr.showDialog(Constants.UIPage.mainUI);

        this.node.on(Node.EventType.TOUCH_START,this.touchStart,this);
        this.node.on(Node.EventType.TOUCH_END,this.touchEnd,this);

        CustomEventListener.on(Constants.EventName.GAMESTART,this.gameStart,this);
        CustomEventListener.on(Constants.EventName.GAMEOVER,this.gameOver,this);
        CustomEventListener.on(Constants.EventName.NEWLEVEL,this.newLevel,this);

        AudioMgr.playMusic(Constants.AudioFiles.BG);
    }

    public gameStart(){
        UIMgr.hideDialog(Constants.UIPage.mainUI);
        UIMgr.showDialog(Constants.UIPage.gameUI);
    }

    public gameOver(){
        UIMgr.hideDialog(Constants.UIPage.gameUI);
        UIMgr.showDialog(Constants.UIPage.resultUI);
        PoolMgr.clear();
    }

    public newLevel(){
        UIMgr.hideDialog(Constants.UIPage.resultUI);
        UIMgr.showDialog(Constants.UIPage.mainUI);        
        if(RunTimeData.instance().currProgress===RunTimeData.instance().maxProgress
            ||RunTimeData.instance().playerData.iscollider)
        {
            RunTimeData.instance().playerData.iscollider=false;
            RunTimeData.instance().playerData.rigidbodys=[];
            this.mapMgr.recycle();        
            this.unschedule(this.loadMap);
            this.scheduleOnce(this.loadMap,0.03);                        
        }
        else
        {            
            this.reset();
        }
    }

    private touchStart(touch:Touch,event:EventTouch)
    {
        this.carMgr.controlMoving(true);
    }

    public touchEnd(touch:Touch,event:EventTouch)
    {
        this.carMgr.controlMoving(false);
    }

    private reset(){
        this.mapMgr.resetMap();
        this.carMgr.reset(this.mapMgr.currPath);
        this.runTimeData.maxProgress = this.mapMgr.maxProgress;
        this.runTimeData.currProgress = 0;
        this.runTimeData.isTakeOver = true;
        this.runTimeData.money = 0;
    }

    private loadMap(cb?:Function){
        this.LoadingUI.show();
        let map = 'map/map';
        let level=this.runTimeData.currLevel;
        if(level>Constants.MaxLevel){
            level=Math.ceil(Math.random()*Constants.MaxLevel);
            if(level<1){level=1};
        }
        if(level>=100){
            map +=`${level}`;
        }else if(level>=10){
            map +=`1${level}`
        }else if(level>0){
            map +=`10${level}`
        }
        this.progress = 5;
        this.unschedule(this.loadingSchedule);
        this.scheduleOnce(this.loadingSchedule,0.2);
        //console.log("map load start:"+map);
        resources.load(map,Prefab,(err:any,prefab:Prefab)=>{
            if(err){
                console.warn(err);
                return;
            };
            const mapNode=instantiate(prefab) as Node;
            mapNode.parent = this.mapMgr.node;
            // if(cb){
            //     cb();
            // }
            this.progress=0;
            //console.log("map load done");
            this.reset();
            this.LoadingUI.finishLoading();
        });
    }

    private loadingSchedule(){
        if(this.progress<0){
            return;
        }
        this.progress --;
        CustomEventListener.dispatchEvent(Constants.EventName.UPDATEPROGRESS,40/5);
        this.unschedule(this.loadingSchedule);
        this.scheduleOnce(this.loadingSchedule,0.2);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
