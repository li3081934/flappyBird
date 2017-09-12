class Draw{
    constructor(context,position,img){
        this.position=position;
        this.context=context;
        this.img=img;
        this.size={
            w:img.width,
            h:img.height
        }
    }
    draw(){
        let {x,y}=this.position;
        this.context.drawImage(this.img,x,y)
    }
    hitCheck(o2,o1=this){
        let {x:x2,y:y2}=o2.position,{w:w2,h:h2}=o2.size;
        let {x:x1,y:y1}=o1.position,{w:w1,h:h1}=o1.size;
        let o1center={
            x:w1/2+x1,
            y:h1/2+y1
        };
        let o2center={
            x:w2/2+x2,
            y:h2/2+y2
        };

        if(Math.abs(o1center.x-o2center.x)<=w1/2+w2/2){
            if(Math.abs(o1center.y-o2center.y)<=h1/2+h2/2){

                let crossX=x1+w1-x2>w1?x2+w2-x1:x1+w1-x2;
                let crossY=y1+h1-y2>h1?y2+h2-y1:y1+h1-y2;
                if(crossX>crossY){
                    if(y2>y1){
                        return 'top'
                    }else{
                        return 'bottom'
                    }

                }else{
                    if(x2>x1){
                        return 'right'
                    }else{
                        return 'left'
                    }

                }
            }
        }

    }
}
function createImgObj(url){
    let img=new Image();
    img.src=url;
    return img;
}
class Layout{
    constructor(container,index,size){
        debugger
        this.size=size
        this.wrap=document.createElement('div');
        this.canvas=document.createElement('canvas');
        this.canvas.width=size.w;
        this.canvas.height=size.h;
        this.ctx=this.canvas.getContext('2d');
        this.wrap.className='layout_'+index;
        this.wrap.appendChild(this.canvas)
        container.appendChild(this.wrap)
    }
    draw(img=this.img,position=this.position){
        let {x,y}=position;
        this.img=img;
        this.position=position
        this.ctx.drawImage(img,x,y)
    }
    clear(){
        this.ctx.clearRect(0,0,this.size.w,this.size.h)
    }


}
class LayoutGround extends Layout{
    constructor(container,index,size){
        super(container,index,size)
    }
    scroll(){
        this.timer=setInterval(()=>{
            this.clear();
            let x=0;

            this.position.x-=3;
            this.position.x%=24;
            this.draw()
        },1000/30)
    }
}
class LayoutBird extends Layout{
    constructor(container,index,size){
        super(container,index,size)
        this.cutPosition={
            x:0,
            y:0
        }
        this.times=0
        this.v0=0
        this.g=0.07;
        this.flydirection=false
        this.reverseG=0.25
    }
    draw(img=this.img,position=this.position){
        let {x,y}=position,{x:cx,y:cy}=this.cutPosition;
        this.img=img;
        this.position=position
        this.ctx.drawImage(img,cx,cy,36,26,x,y,36,26)


    }
    gravity(){
        console.log(this.position.y)
        if(this.position.y>=this.size.h-26-22){
            debugger
        }else{
            this.v0+=this.g;
            this.position.y+=this.v0+this.g/2
        }

    }
    changeFly(way){
        return (e)=>{
            if(e.key==='w'){
                this.flydirection=way
            }

        }

    }
    keyBind(){
        window.addEventListener('keydown',this.changeFly(true))
        window.addEventListener('keyup',this.changeFly(false))
    }
    flyUp(){
        this.v0-=this.reverseG;
        this.position.y+=this.v0-this.reverseG/2
    }
    fly(){
        this.keyBind()
        this.timer=setInterval(()=>{
            this.clear();
            let f=Math.ceil(this.times/12)
            this.cutPosition.x=36*f;
            this.cutPosition.x%=108;


            if(this.flydirection){
                this.flyUp()
            }
            this.gravity()



            this.draw()
            this.times++;
            this.times%=60;
        },1000/60)
    }
}
class Scene{
    constructor(container){
        this.bgImg=createImgObj('./images/bg.png')
        this.container=container
        this.bgImg.onload=()=>{
            let bgLayout=new Layout(this.container,0,{w:288,h:384})
            this.bgLayout=bgLayout
            bgLayout.draw(this.bgImg,{x:0,y:0})
        }


        this.groundImg=createImgObj('./images/ground.png')
        this.groundImg.onload=()=>{
            let groundLayout=new LayoutGround(this.container,1,{w:288,h:384})
            this.groundLayout=groundLayout
            groundLayout.draw(this.groundImg,{x:0,y:362})
        }
        this.birdImg=createImgObj('./images/bird.png')
        this.birdImg.onload=()=>{
            let birdLayout=new LayoutBird(this.container,2,{w:288,h:384})
            this.birdLayout=birdLayout
            birdLayout.draw(this.birdImg,{x:140,y:150})
        }

    }

    start(){

        this.groundLayout.scroll()
        this.birdLayout.fly()
    }
}