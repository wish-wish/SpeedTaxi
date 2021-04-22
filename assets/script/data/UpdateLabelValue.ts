import { _decorator, Component, Node, LabelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UpdateLabelValue')
export class UpdateLabelValue extends LabelComponent {

    private startVal = 0;
    private endVal = 0;
    private diffVal = 0;
    private currTime=0;
    private changeTime=0;
    private isPlaying = false;

    public playUpdateValue(start:number,end:number,changeTime:number){
        this.startVal = start;
        this.endVal = end;
        this.diffVal = this.endVal-this.startVal;
        this.currTime = 0;
        this.changeTime = changeTime;
        if(changeTime===0){
            this.string=`${this.endVal}`;
            return;
        }
        this.string=`${this.startVal}`;
        this.isPlaying = true;
    }

    public update(dt:number){
        if(!this.isPlaying)
        {
            return;
        }
        if(this.currTime<this.changeTime){
            this.currTime+=dt;
            const targetVal=this.startVal+Math.floor((this.currTime/this.changeTime)*this.diffVal);
            this.string=`${targetVal}`;
            return;
        }
        this.string = `${this.endVal}`;
        this.isPlaying = false;
    }

}
