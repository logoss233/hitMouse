export default class Hammer extends Laya.Script {
    
    constructor() { super(); }
    
    onEnable(): void {
    }

    onDisable(): void {
    }
    playAni(){
        let owner=this.owner as Laya.Sprite
        var time=100
        owner.alpha=1
        owner.rotation=0
        var timeLine=Laya.TimeLine.to(this.owner,{rotation:9},time).
        to(owner,{rotation:-9},time*2).
        to(owner,{rotation:0},time,null,100).
        to(owner,{alpha:0},200,null,500)
        timeLine.play(0,false)
        timeLine.on(Laya.Event.COMPLETE,this,function(){
            this.owner.removeSelf()
        })
    }
}