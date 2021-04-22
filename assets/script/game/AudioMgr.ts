import { _decorator, Component, Node, resources, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export class AudioMgr {
    
    public static playMusic(name:string){
        const path='audio/music/'+name;
        resources.load(path,AudioClip,(err:any,clip:AudioClip)=>{
            if(err){
                console.warn(err);
                return;
            }
            clip.setLoop(true);
            clip.play();
        });
    }

    public static playSound(name:string){
        const path='audio/sound/'+name;
        resources.load(path,AudioClip,(err:any,clip:AudioClip)=>{
            if(err){
                console.warn(err);
                return;
            }
            clip.setLoop(false);
            clip.playOneShot(1);
        });
    }
}
