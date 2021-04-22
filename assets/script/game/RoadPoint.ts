import { _decorator, Component, Node, Vec3, Enum, macro } from 'cc';
const { ccclass, property } = _decorator;

enum ROAD_POINT_TYPE{
    NORMAL=1,
    START,
    GREETING,
    GOODBYE,
    END,
    AI_START,
}
Enum(ROAD_POINT_TYPE);

enum ROAD_MOVE_TYPE{
    LINE=1,
    CURVE,
}
Enum(ROAD_MOVE_TYPE);

@ccclass('RoadPoint')
export class RoadPoint extends Component {
    public static RoadPointType = ROAD_POINT_TYPE;
    public static RoadMoveType = ROAD_MOVE_TYPE;

    @property({
        type:ROAD_POINT_TYPE,
        displayOrder:1,
    })
    type = ROAD_POINT_TYPE.NORMAL;

    @property({
        type:Node,
        displayOrder:2,
        visible:function(this:RoadPoint){
            return true;//this.type !==ROAD_POINT_TYPE.END;
        }
    })
    nextStation:Node = null;

    @property({
        type:ROAD_MOVE_TYPE,
        displayOrder:3,
        visible:function(this:RoadPoint){
            return this.type !==ROAD_POINT_TYPE.END;
        }
    })
    moveType = ROAD_MOVE_TYPE.LINE;

    @property({
        displayOrder:4,
        visible:function(this:RoadPoint){
            return this.type !==ROAD_POINT_TYPE.END && this.moveType === ROAD_MOVE_TYPE.CURVE;
        }
    })
    clockwise = true;

    @property({
        type:Vec3,
        visible:function(this:RoadPoint){
            return this.type === ROAD_POINT_TYPE.GOODBYE || this.type === ROAD_POINT_TYPE.GREETING;
        }
    })
    direction = new Vec3(1,0,0)

    @property({
        visible:function(this:RoadPoint){
            return this.type === ROAD_POINT_TYPE.AI_START;
        }
    })
    interval = 3;

    @property({
        visible:function(this:RoadPoint){
            return this.type === ROAD_POINT_TYPE.AI_START;
        }
    })
    delayTime = 0;

    @property({
        visible:function(this:RoadPoint){
            return this.type === ROAD_POINT_TYPE.AI_START;
        }
    })
    speed = 0.05;

    //201,202
    @property({
        visible:function(this:RoadPoint){
            return this.type === ROAD_POINT_TYPE.AI_START;
        }
    })
    cars = "201";

    private arrCars:string[]=[];
    private cd:Function = null;

    public start () {
        this.arrCars=this.cars.split(',');
        // Your initialization goes here.
    }

    public startSchedule(cd:Function){
        if(this.type!==ROAD_POINT_TYPE.AI_START)
        {
            return;
        }
        this.stopSchedule();
        this.cd=cd;
        this.scheduleOnce(this.startDelay,this.delayTime);
    }

    public stopSchedule(){
        this.unschedule(this.startDelay);
        this.unschedule(this.scheduleCD);
    }

    private startDelay(){
        //this.scheduleCD();
        this.unschedule(this.scheduleCD);
        this.schedule(this.scheduleCD,this.interval,macro.REPEAT_FOREVER);
    }

    private scheduleCD(){
        const index=Math.floor(Math.random()*this.arrCars.length);
        if(this.cd){
            this.cd(this,this.arrCars[index]);
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
