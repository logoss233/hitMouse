import GameMgr from "./GameMgr";

export default class Mouse extends Laya.Script {
    /** @prop {name:mouseType, tips:"老鼠类型", type:Int, default:1}*/
    mouseType:Number=1

    timeLine:Laya.TimeLine=null
    isDead:Boolean=false
    mgr:GameMgr=null

    constructor() { super(); }
    
    onEnable(): void {
    }

    onDisable(): void {
    }
    showMouse(type:Number,mgr:GameMgr){
        this.mgr=mgr
        this.mouseType=type
        let owner=this.owner as Laya.Image
        owner.skin="res/mouse_normal_"+type+".png"
        //老鼠怎么出来
        owner.scaleX=0
        owner.scaleY=0
        //TimeLine--->
        this.timeLine=Laya.TimeLine.to(owner,{scaleX:1,scaleY:1},300).
        to(owner,{scaleX:0,scaleY:0},300,null,1000)
        this.timeLine.play(0,false)
        this.timeLine.on(Laya.Event.COMPLETE,this,function(){
            this.owner.removeSelf()
        })
    }
    playHitAni(){
        if (this.timeLine!=null){
            this.timeLine.destroy()
        }
        let owner=this.owner as Laya.Image
        owner.skin="res/mouse_hit_"+this.mouseType+".png"
        owner.scaleX=1
        owner.scaleY=1
        this.timeLine=Laya.TimeLine.to(owner,{scaleX:0,scaleY:0},300,null,500)
        this.timeLine.play(0,false)
        this.timeLine.on(Laya.Event.COMPLETE,this,function(){
            this.owner.removeSelf()
        })
    }
    onMouseDown(){
        if(this.isDead){
            return
        }
        this.isDead=true
        this.playHitAni()
        this.mgr.onMouseHit(this)
    }
}