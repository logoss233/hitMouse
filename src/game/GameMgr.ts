import Mouse from "./Mouse";
import Hammer from "./Hammer";

export default class GameMgr extends Laya.Script {
    /** @prop {name:mousePrefab,tips:"老鼠预制体",type:Prefab,default:null} */
    mousePrefab:Laya.Prefab=null
    /** @prop {name:mouseRoot,tips:"老鼠父节点",type:Node,default:null} */
    mouseRoot:Laya.Node=null
    /** @prop {name:hammerPrefab,tips:"锤子预制体",type:Prefab,default:null} */
    hammerPrefab:Laya.Prefab=null
    /** @prop {name:textPrefab,tips:"文本预制体",type:Prefab,default:null} */
    textPrefab:Laya.Prefab=null
    textRoot:Laya.Node=null
    scoreLabel:Laya.Label=null

    mousePositions=[
        {x:-238.5,y:-4.5},
        {x:-43.5,y:-3.5},
        {x:148.5,y:0},
        {x:-261.5,y:87},
        {x:-49,y:88},
        {x:151,y:85.5},
        {x:-273,y:185},
        {x:-48.5,y:190.5},
        {x:170.5,y:191.5}
    ]
    // hammerPositions=[
    //     {x:-98,y:-65},
    //     {x:88,y:-77},
    //     {x:294,y:-69},
    //     {x:-112,y:-20},
    //     {x:96,y:20},
    //     {x:285,y:4},
    //     {x:-128,y:118},
    //     {x:93,y:129},
    //     {x:309,y:129}
    // ]

    score:number=0


    constructor() { super(); }
    
    onEnable(): void {
        this.textRoot=this.owner.getChildByName("canvas").getChildByName("TextRoot")
        this.scoreLabel=this.owner.getChildByName("canvas").getChildByName("ScoreLabel") as Laya.Label
    }

    onDisable(): void {
    }

    createOneMouse(){
        var mouse=this.mousePrefab.create() as Laya.Sprite
        this.mouseRoot.addChild(mouse)

        //随机洞的索引
        var holeIndex=Math.floor(Math.random()*9)
        mouse.x=this.mousePositions[holeIndex].x
        mouse.y=this.mousePositions[holeIndex].y
        //随机老鼠的种类
        var type=Math.floor(Math.random()*2+1)

        mouse.getComponent(Mouse).showMouse(type,this)


        var time=(2+Math.random()*2)*1000
        time=Math.floor(time)
        Laya.timer.once(time,this,this.createOneMouse)
    }
    onStart(){
        this.createOneMouse()
    }

    /**
     * 打中老鼠后的回调
     */
    onMouseHit(mouse:Mouse){
        var mouseObj=mouse.owner as Laya.Sprite
        //打中老鼠时触发，根据老鼠类型得分
        var type=mouse.mouseType
        var score=0
        var txtObj=this.textPrefab.create() as Laya.Label
        this.textRoot.addChild(txtObj)
        txtObj.x=mouseObj.x+30
        txtObj.y=mouseObj.y-50
        if(type==1){
            txtObj.text="-100"
            txtObj.color="black"
            score=-100
        }else{
            txtObj.text="+100"
            txtObj.color="red"
            score=100
        }
        let timeLine=Laya.TimeLine.to(txtObj,{y:txtObj.y-100},500)
        timeLine.play(0,false)
        timeLine.on(Laya.Event.COMPLETE,txtObj,function(){
            this.removeSelf()
        })
        //更新分数
        this.score+=score
        this.scoreLabel.text=this.score.toString()

        //生成锤子 调整锤子的位置
        var hammerObj=this.hammerPrefab.create() as Laya.Sprite
        this.mouseRoot.addChild(hammerObj)
        hammerObj.x=mouseObj.x+80
        hammerObj.y=mouseObj.y-40
        //播放锤子的动画
        var hammer=hammerObj.getComponent(Hammer) as Hammer
        hammer.playAni()
    }
    
}