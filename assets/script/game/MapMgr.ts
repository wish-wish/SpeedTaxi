import { _decorator, Component, Node } from 'cc';
import { GameMap } from './GameMap';
const { ccclass, property } = _decorator;

@ccclass('MapMgr')
export class MapMgr extends Component {
    
    public currPath:Node[] = [];
    public maxProgress = 0;

    private currMap:Node = null;

    public resetMap(){
        this.currMap = this.node.children[0];
        const currMap = this.node.children[0].getComponent(GameMap);
        this.currPath = currMap.path;
        this.maxProgress = currMap.maxProgress;
    }

    public recycle(){
        if(this.currMap){
            //console.log("map destory");
            this.currMap.destroy();
            this.currMap = null;
        }
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
