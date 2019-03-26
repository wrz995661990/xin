if(typeof HTMLElement=='undefined'){var HTMLElement=function(){};if(window.webkit)document.createElement("iframe");HTMLElement.prototype=(window.webkit)?window["[[DOMElement.prototype]]"]:{};}
HTMLElement.prototype.getPixelColor=function(x,y){var thisContext=this.getContext("2d");var imageData=thisContext.getImageData(x,y,1,1);var pixel=imageData.data;var r=pixel[0];var g=pixel[1];var b=pixel[2];var a=pixel[3]/255
    a=Math.round(a*100)/100;var rHex=r.toString(16);r<16&&(rHex="0"+rHex);var gHex=g.toString(16);g<16&&(gHex="0"+gHex);var bHex=b.toString(16);b<16&&(bHex="0"+bHex);var rgbaColor="rgba("+r+","+g+","+b+","+a+")";var rgbColor="rgb("+r+","+g+","+b+")";var hexColor="#"+rHex+gHex+bHex;return{rgba:rgbaColor,rgb:rgbColor,hex:hexColor,r:r,g:g,b:b,a:a};}


/**
 * 绘制工具
 * @param canvasId  div的id
 * @param imgUrl  牙位图片的url
 */
function YwtUtil(canvasId,imgUrl) {
    this.list=[];       //存储itemView对象
    this.divcontain=document.getElementById(canvasId);
    this.divcontain.style.padding="0px";
    this.divcontain.style.position="relative";
    this.canvas=document.createElement("canvas");
    this.divcontain.appendChild(this.canvas);
    this.canvas.style.cssText="width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index:2";
    this.ctx=this.canvas.getContext("2d");
    this.imgUrl=imgUrl;
    this.imgDom=null;
    this.normalColor="rgba(255,255,255,1)";

    /**
     * 初始化环境
     */
    this.init=function () {
        var me=this;
        var width = this.canvas.offsetWidth;
        var height = this.canvas.offsetHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.imgDom=document.createElement("img");
        this.imgDom.crossOrigin = "*";
        //添加canvas事件
        this.canvas.addEventListener('click', function(e){
            me.canvasClickHand(e);
        }, false);
        this.imgDom.onload=function (e) {
            this.imgDom.style.width=this.divcontain.offsetWidth+"px";
            this.imgDom.style.height=this.divcontain.offsetHeight+"px";
            this.imgDom.style.position="absolute";
            this.imgDom.style.top="0px";
            this.imgDom.style.left="0px";
            this.imgDom.style.zIndex="1";
            this.divcontain.appendChild(this.imgDom);
        }.bind(this);
        this.imgDom.setAttribute("src",this.imgUrl);
    };

    /**
     * 设置普通填充颜色值
     * @param normalColor
     */
    this.setNormalColor=function (normalColor) {
        this.normalColor=normalColor;
    };

    /**
     * 绘图-扇形
     * @param x 中心X坐标
     * @param y 中心Y坐标
     * @param radius 半径
     * @param startAngle 起始角度值
     * @param endAngle 结束角度值
     * @param fun 回调function
     */
    this.createSector=function (x,y,radius,startAngle,endAngle,fun) {
        var item=new ItemViewSection(this,this.ctx,x,y,radius,startAngle,endAngle,fun);
        item.drawSector();
        this.list.push(item);
    };


    /**
     * 绘制圆角扇形
     * @param x x坐标
     * @param y y坐标
     * @param lineWidth 扇形的厚度
     * @param radius 半径
     * @param startAngle 起始角度
     * @param endAngle 结束角度值
     * @param fun
     */
    this.createSemSector=function (x,y,lineWidth,radius,startAngle,endAngle,fun) {
        var item=new ItemViewSemSector(this,this.ctx,x,y,lineWidth,radius,startAngle,endAngle,fun);
        item.drawSector();
        this.list.push(item);
    };

    /**
     * 开启鼠标移动二态
     * @param color 颜色
     */
    this.openMouseState=function (color) {
        this.canvas.addEventListener("mousemove",function (e) {
            var point=this.getEventPosition(e);
            var colorData=this.canvas.getPixelColor(point.x,point.y);
            if(colorData.hex=="#000000"){
                this.canvas.style.cursor="auto";        //控制鼠标样式
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                for(var i=0;i<this.list.length;i++){
                    this.list[i].drawSector();
                }
            }else{
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                for(var i=0;i<this.list.length;i++){
                    this.list[i].drawSector();
                    this.list[i].mouseMoveHand(e,color);
                }
            }
        }.bind(this),false);
    };

    /**
     * 绘制矩形
     * @param x x坐标
     * @param y y坐标
     * @param w 宽度
     * @param h 高度
     * @param fun
     */
    this.createRect=function (x, y, w, h,fun) {
        var item=new ItemViewRect(this,this.ctx,x,y,w,h,fun);
        item.drawSector();
        this.list.push(item);
    };



    /**
     * 画布点击事件
     * @param e
     */
    this.canvasClickHand=function (e) {
        //console.warn("重绘"+Math.random());
        var clickPoint=this.getEventPosition(e);
        var colorData = this.canvas.getPixelColor(clickPoint.x, clickPoint.y);
        if(colorData.hex=="#000000"){
            return;
        }
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for(var i=0;i<this.list.length;i++){
            this.list[i].drawSector();
            this.list[i].resetDrawSector(clickPoint);
        }
    };

}

//绘制扇形
CanvasRenderingContext2D.prototype.drawSector=function(x,y,radius,startAngle,endAngle,fillColor){
    this.save();
    this.beginPath();
    this.moveTo(x,y);
    this.arc(x,y,radius,startAngle*Math.PI,endAngle*Math.PI,false);
    this.closePath();
    this.fillStyle = fillColor;
    //this.restore();
    return this;
};

//绘制半圆扇形
CanvasRenderingContext2D.prototype.drawSemSector=function(x,y,lineWidth,radius,startAngle,endAngle,fillColor){
    this.save();
    this.lineWidth = lineWidth;
    this.beginPath();
    this.strokeStyle = fillColor;
    this.arc(x, y, radius, startAngle, endAngle, false);
    this.stroke();
    //this.restore();
    return this;
};

//绘制矩形
CanvasRenderingContext2D.prototype.drawRectangle=function(x,y,width,height,fillColor){
    this.save();
    this.beginPath();
    this.moveTo(x,y);
    this.rect(x,y,width,height);
    this.fillStyle=fillColor;
    this.fill();
    this.closePath();
    //this.restore();
    return this;
};

//判断是否点击canvas区域
CanvasRenderingContext2D.prototype.checkClick=function(x,y){
    var isIn = false;
    // 获取context
    // 模拟重绘需要判断时间的图形
    this.save();
    if (this.isPointInPath(x, y)) {
        isIn = true;
    }
    this.restore();
    return isIn;
};


YwtUtil.prototype.getEventPosition=function(ev) {
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {x: x, y: y};
};




//扇形对象
function ItemViewSection(utilObj,ctx,x,y,radius,startAngle,endAngle,fun) {
    this.utilObj=utilObj;
    this.ctx=ctx;
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.startAngle=startAngle;
    this.endAngle=endAngle;
    this.fun=fun;
    this.isMouseCheck=false;    //是否移动到了自己身上

    //初始化绘制
    this.drawSector=function(){
        this.ctx.drawSector(this.x,this.y,this.radius,this.startAngle,this.endAngle,this.utilObj.normalColor).fill();
    };


    //重绘
    this.resetDrawSector=function(point){
        this.ctx.drawSector(this.x,this.y,this.radius,this.startAngle,this.endAngle);
        if(this.ctx.checkClick(point.x,point.y)){
            if(fun!=undefined){
                fun({error:0,msg:"点击"});
            }
        }
    };


    //鼠标移动事件
    this.mouseMoveHand=function (e,color) {
        var clickPoint=this.utilObj.getEventPosition(e);
        if(this.ctx.checkClick(clickPoint.x,clickPoint.y)){
            this.isMouseCheck=true;
            this.ctx.drawSector(this.x,this.y,this.radius,this.startAngle,this.endAngle,color).fill();
        }else{
            this.isMouseCheck=false;
        }
        var cursor="auto";
        for(var i=0;i<this.utilObj.list.length;i++){
            var obj=this.utilObj.list[i];
            if(obj.isMouseCheck==true){
                cursor="pointer";
                break;
            }
        }
        this.utilObj.canvas.style.cursor=cursor;        //控制鼠标样式
    };

}



//半圆扇形
function ItemViewSemSector(utilObj,ctx,x,y,lineWidth,radius,startAngle,endAngle,fun) {
    this.utilObj=utilObj;
    this.ctx=ctx;
    this.x=x;
    this.y=y;
    this.lineWidth=lineWidth;
    this.radius=radius;
    this.startAngle=startAngle;
    this.endAngle=endAngle;
    this.fun=fun;
    this.isMouseCheck=false;    //是否移动到了自己身上

    //初始化绘制
    this.drawSector=function(){
        this.ctx.drawSemSector(this.x,this.y,this.lineWidth,this.radius,this.startAngle,this.endAngle,this.utilObj.normalColor);
    };


    //重绘
    this.resetDrawSector=function(point){
        //this.ctx.drawSemSector(this.x,this.y,this.lineWidth,this.radius,this.startAngle,this.endAngle,this.utilObj.normalColor);
        if(this.ctx.checkClick(point.x,point.y)){
            if(fun!=undefined){
                fun({error:0,msg:"点击"});
            }
        }
    };


    //鼠标移动事件
    this.mouseMoveHand=function (e,color) {
        var clickPoint=this.utilObj.getEventPosition(e);
        if(this.ctx.checkClick(clickPoint.x,clickPoint.y)){
            this.isMouseCheck=true;
            this.ctx.drawSemSector(this.x,this.y,this.lineWidth,this.radius,this.startAngle,this.endAngle,color);
        }else{
            this.isMouseCheck=false;
        }
        var cursor="auto";
        for(var i=0;i<this.utilObj.list.length;i++){
            var obj=this.utilObj.list[i];
            if(obj.isMouseCheck==true){
                cursor="pointer";
                break;
            }
        }
        this.utilObj.canvas.style.cursor=cursor;        //控制鼠标样式
    };

}




//矩形对象
function ItemViewRect(utilObj,ctx,x,y,width,height,fun) {
    this.utilObj=utilObj;
    this.ctx=ctx;
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.fun=fun;
    this.isMouseCheck=false;    //是否移动到了自己身上

    //初始化绘制
    this.drawSector=function(){
        this.ctx.drawRectangle(this.x,this.y,this.width,this.height,this.utilObj.normalColor);
    };


    //点击事件处理方法
    this.resetDrawSector=function(point){
        //this.ctx.drawRectangle(this.x,this.y,this.width,this.height,this.utilObj.normalColor);
        if(this.ctx.checkClick(point.x,point.y)){
            if(fun!=undefined){
                fun({error:0,msg:"点击"});
            }
        }
    };


    //鼠标移动事件
    this.mouseMoveHand=function (e,color) {
        var clickPoint=this.utilObj.getEventPosition(e);
        if(this.ctx.checkClick(clickPoint.x,clickPoint.y)){
            this.isMouseCheck=true;
            this.ctx.drawRectangle(this.x,this.y,this.width,this.height,color);
        }else{
            this.isMouseCheck=false;
        }
        var cursor="auto";
        for(var i=0;i<this.utilObj.list.length;i++){
            var obj=this.utilObj.list[i];
            if(obj.isMouseCheck==true){
                cursor="pointer";
                break;
            }
        }
        this.utilObj.canvas.style.cursor=cursor;        //控制鼠标样式
    };

}
