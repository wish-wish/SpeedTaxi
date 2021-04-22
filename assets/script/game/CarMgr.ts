import { _decorator, Component, Node, resources, Prefab, Vec3, macro } from 'cc';
import { Car } from './Car';
import { RoadPoint } from './RoadPoint';
import { PoolMgr } from '../data/PoolMgr';
import { CustomEventListener } from '../data/CustomEventListener';
import { Constants } from '../data/Constants';
import { IPLayerInfo, RunTimeData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('CarMgr')
export class CarMgr extends Component {
    
    @property({
        type:Car,
    })
    mainCar:Car = null;

    @property({
        type:Node,
    })
    camera:Node = null;

    @property
    cameraPos=new Vec3(0.012,5.267,13.121);

    @property
    cameraRotation = -79;

    private currPath:Node[]=[];
    private aiCars:Car[]=[];

    public reset(points:Node[]){
        if(points.length<=0){
            console.warn("There is no points in this map");
        }else{
            this.recycleAllAICar();
            this.currPath=points;
            this.createMainCar(points[0],true);
        }
    }

    public logCameraInfo()
    {
        console.log("cameraPos:"+this.camera.position);
        console.log("cameraRot:"+this.camera.rotation);
    }

    private createMainCar(point:Node,isMain=false){
        //console.log(point.worldPosition);
        this.mainCar.setEntry(point,isMain);
        var pi:IPLayerInfo;
        pi=RunTimeData.instance().playerData.playerIno;
        this.mainCar.setCamera(this.camera,this.cameraPos,this.cameraRotation);
    }

    public controlMoving(isRunning=true){
        if(isRunning){
            CustomEventListener.dispatchEvent(Constants.EventName.SHOWGUIDE,false);
            this.mainCar.startRunning();
        }else
        {
            this.mainCar.stopRunning();
        }
    }

    private startSchedule(){
        for(let i=1;i<this.currPath.length;i++){
            const node=this.currPath[i];
            //console.log(node.name+":"+this.currPath.length);
            if(node.components!==null){
                const roadPoint = node.getComponent(RoadPoint);
                roadPoint.stopSchedule();
                roadPoint.startSchedule(this.createEnemy.bind(this));
            }
            else
            {
                console.log("why node name is null");
            }
        }
    }

    private stopSchedule(){
        for(let i=1;i<this.currPath.length;i++){
            const node=this.currPath[i];
            if(node.components!==null){
                const roadPoint = node.getComponent(RoadPoint);
                roadPoint.stopSchedule(); 
            }
        }
    }

    private createEnemy(road:RoadPoint,carID:string){
        const self=this;
        resources.load('car/car'+carID,Prefab,(err:any,prefab:Prefab)=>{
            if(err){
                console.warn(err);
                return;
            }
            const car = PoolMgr.getNode(prefab,self.node);
            const carComp=car.getComponent(Car);
            this.aiCars.push(carComp);
            carComp.setEntry(road.node);
            carComp.maxSpeed = road.speed;
            carComp.startRunning();
            carComp.moveAfterFinished(this.recycleAICar.bind(this));
        });
    }

    private recycleAICar(car:Car){
        const index=this.aiCars.indexOf(car);
        if(index>=0){
            PoolMgr.setNode(car.node);
            this.aiCars.splice(index,1);
        }
    }

    private recycleAllAICar(){
        for(let i=0;i<this.aiCars.length;i++){
            const car = this.aiCars[i];
            PoolMgr.setNode(car.node);
        }
        this.aiCars.length=0;
    }

    public start () {
        CustomEventListener.on(Constants.EventName.GAMESTART,this.gameStart,this);
        CustomEventListener.on(Constants.EventName.GAMEOVER,this.gameOver,this);
    }

    private gameStart(){
        this.mainCar.startWithMinSpeed();
        this.schedule(this.checkCarIsCloser,0.1,macro.REPEAT_FOREVER);
        this.startSchedule();
    }

    private gameOver(){
        this.stopSchedule();
        this.mainCar.stopImmediately();
        this.camera.setParent(this.node.parent,true);
        for(let i=0;i<this.aiCars.length;i++){
            const icar=this.aiCars[i];
            icar.stopImmediately();
        }
        this.unschedule(this.checkCarIsCloser);
    }

    private checkCarIsCloser(){
        const mainCarPos = this.mainCar.node.worldPosition;
        for(let i=0;i<this.aiCars.length;i++){
            const aiCar = this.aiCars[i];
            const pos=aiCar.node.worldPosition;
            if(Math.abs(pos.x-mainCarPos.x)<=2&&Math.abs(pos.z-mainCarPos.z)<=2){
                this.mainCar.tooting();
                break;
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
