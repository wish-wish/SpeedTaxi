
import { _decorator, Component, Node, resources, Prefab, Vec3,instantiate,find, RichTextComponent, RichText, UITransform, Size, view, SystemEventType } from 'cc';
import {} from 'cc/env'
import { PoolMgr } from '../data/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({
        type:Node
    })
    cell:Node=null as any;

    @property({
        type:[Node]
    })
    public cells=[];

    @property({
        type:[Node]
    })
    public funcs=[];
    @property({
        type:Number
    })
    public num=9;

    start () {
        // [3]
        const self=this;
        let cntsize=this.getComponent(UITransform);
        let s=cntsize!.contentSize;        
        let w=s.height;
        if(s.height>s.width)
            w=s.width;
        else
            w=s.height;
        let iw = (w-20)/(self.num+1);
        console.log("cnts:"+s+":"+iw);        
        resources.load("cell/Sprite",Prefab,(err:any,perfab:Prefab)=>{
            if(err)
            {
                console.warn(err);
            }
            for(let i=0;i<self.num*self.num;i++)
            {
                const sprite=instantiate(perfab) as Node;//PoolMgr.newNode(perfab,self.node);
                let s=sprite.getComponent(UITransform);
                s!.contentSize=new Size(iw,iw);
                this.cells.push(sprite);
                sprite.setParent(self.node);
                let x=i%self.num;
                let y=Math.trunc(i/self.num);
                sprite.setPosition(new Vec3((x+1)*iw-w/2,(y+1.5)*iw-w/2+15,0));
                //let rich=find('RichText',this.node);//scene 中的
                //let rich=sprite.getChildByName('RichText');
                //let rt=sprite.getComponentInChildren(RichText);
                //rt!.string=i.toString();
                let rtc=sprite.getComponentInChildren(RichTextComponent);
                rtc!.string=(i%self.num+1).toString();
            }
            for(let i=0;i<self.num;i++)
            {
                const sprite=instantiate(perfab) as Node;//PoolMgr.newNode(perfab,self.node);
                let s=sprite.getComponent(UITransform);
                s!.contentSize=new Size(iw,iw);
                console.log(s!.contentSize);
                this.funcs.push(sprite);
                sprite.setParent(self.node);
                sprite.setPosition(new Vec3((i+1)*iw-w/2,0.5*iw-w/2+5,0));
                let rtc=sprite.getComponentInChildren(RichTextComponent);
                rtc!.string="A"+(i+1).toString();
            }            
        });
        // view.setResizeCallback(function(){
        //     console.log("setResizeCallback");
        // });
        // this.node.on(SystemEventType.SIZE_CHANGED,(event)=>{
        //     console.log('onresize1');
        // },this);

        // this.node.on("orientationchange",(event)=>{
        //     console.log('orientationchange1');
        // },this)
        // window.onresize(function(){
        //     console.log("onresize2");
        // });    
    }
    onresize()
    {
        console.log("onresize3");
    }
    orientationchange()
    {
        console.log("orientationchange");
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
