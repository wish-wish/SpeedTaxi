import { _decorator, Component, Node, find, loader,assetManager,resources, Prefab, InstanceMaterialType, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIMgr')
export class UIMgr {
    
    static dictPanel = new Map<string,Node>();

    public static showDialog(name:string,cb?:Function,...args:any[]){
        const scriptName=name.substr(0,1).toUpperCase()+name.substr(1);
        if(this.dictPanel.has(name)){
            const panel = this.dictPanel.get(name);
            const parent = find('Canvas');
            panel!.parent = parent;
            const comp = panel!.getComponent(scriptName);
            if(comp && comp["show"]){
                comp['show'].apply(comp,args);
            }
            if(cb){
                cb();
            }
            return;
        }
        const path = `ui/${name}`;                
        
        //TODO:释放资源
        //assetManager.dependUtil.getDepsRecursively();
        //resources.release();
        //resources.releaseAll();
        //resources.releaseUnusedAssets();

        //loader.loadRes(path,Prefab,(err:any,prefab:Prefab)=>{
        resources.load(path,Prefab,(err:any,prefab:Prefab)=>{
            if(err){
                console.warn(err);
                return;
            }
            const panel = instantiate(prefab);
            this.dictPanel.set(name,panel);
            const parent = find('Canvas');
            panel.parent = parent;
            const comp = panel.getComponent(scriptName);
            if(comp && comp["show"]){
                comp['show'].apply(comp,args);
            }
            if(cb){
                cb();
            }
        })
    }

    public static hideDialog(name:string,cb?:Function){
        if(this.dictPanel.has(name)){
            const panel=this.dictPanel.get(name);
            panel!.parent=null;
            const scriptName=name.substr(0,1).toUpperCase()+name.substr(1);
            const comp = panel!.getComponent(scriptName);
            if(comp && comp["hide"]){
                comp['hide'].apply(comp);
            }
            if(cb){
                cb();
            }
        }
    }
    

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
