import { _decorator, Component, Node } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
export class ConfigMgr {
    private jsonData={};
    private markSave = false;

    static _instance:ConfigMgr = null;
    public static instance(){
        if(!this._instance){
            this._instance = new ConfigMgr();
        }
        return this._instance;
    }

    public init(){
        const localStorage = cc.sys.localStorage.getItem(Constants.GameConfigID);
        if(localStorage){
            this.jsonData = JSON.parse(localStorage);
        }
        setInterval(this.scheduleSave.bind(this),500)
    }

    public getConfigData(key:string){
        const data = this.jsonData[key];
        return data || '';
    }

    public setConfigData(key:string,value:string){
        this.jsonData[key]=value;
        this.markSave=true;
    }

    private scheduleSave(){
        if(!this.markSave)
        {
            return;
        }
        const data = JSON.stringify(this.jsonData);
        cc.sys.localStorage.setItem(Constants.GameConfigID,data);
        this.markSave = false;
    }
}
