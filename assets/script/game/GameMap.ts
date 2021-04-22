import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameMap')
export class GameMap extends Component {
    @property({
        type:[Node]
    })
    path:Node[]=[];

    public maxProgress = 2;
    
    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
