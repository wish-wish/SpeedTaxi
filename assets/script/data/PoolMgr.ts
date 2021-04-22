import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolMgr')
export class PoolMgr {
    
    private static handle = new Map<string,Node[]>();

    public static getNode(perfab:Prefab,parent:Node){
        const name=perfab.name;
        let node:Node = null;
        if(this.handle.has(name)){
            node = this.handle.get(name).pop();
        }else
        {
            node=instantiate(perfab) as Node;
        }
        node.setParent(parent);
        return node;
    }

    public static setNode(target:Node){
        const name=target.name;
        target.parent = null;
        if(this.handle.has(name)){
            this.handle.get(name).push(target);
        }else
        {
            this.handle.set(name,[target]); 
        }
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
