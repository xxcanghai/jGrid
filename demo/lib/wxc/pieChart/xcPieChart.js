//create:   2014-12-9
//update:   2014-12-10
//-----wxc.pieChart----
(function($){
	window.wxc = window.wxc || {};
	var wxc = window.wxc;
	
	//饼状图插件 构造函数
    wxc.pieChart = pieChart;
    function pieChart(config) {
        if (this === window.wxc) return new window.wxc.pieChart(config);
        config = $.extend(true, {
            element: null,//插件对应jquery对象,canvas容器,必填
			id:"canvas_" + new Date().getTime(),//canvas的id
			dataArr:[],//图表的数据集,必填
            //--Event--
            animate:$.noop//
        }, config);
        
        if(config.element === null){
        	alert("请传入element对象~");return;
        }
        if(config.dataArr.length < 1){
        	alert("请传入图表数据数组~");return;
        }
        
        var _this = this;
        var element = config.element;
        var canvasId = config.id;
        var dataArr = config.dataArr;
        var cvsH = dataArr.length > 10 ? dataArr.length * 30 : 300;
        
        init();
        function init() {
			creatDom();			
        }
		
		//将绘制好的图表添加到容器中
		function creatDom(){
			if(document.getElementById(canvasId)){alert("canvas的id重复!");return;}
			element.append(creatCanvas(canvasId,600,cvsH));
			var canvas = document.getElementById(canvasId);
			drawPieChart(canvas);		
		}
		
		//绘制饼状统计图表-为统计图添加标注
		function drawPieChart(canvas){			
		    var ctx = canvas.getContext("2d");  		
		    var cObj = drawCircle();//生成饼图	    
			ctx.putImageData(cObj.imgData, 0, 0);
			var width = 60, height = 20;//图例宽和高
			var posX = cObj.width + 30;
			var posY = cObj.height > dataArr.length*30 ? (cObj.height - dataArr.length*30)/2 : 0;//图例位置设置
			var textX = posX + width + 10, textY = posY + 17;  
			
			//绘制比例图及文字  
			for (var i = 0; i < dataArr.length; i++) {  
		        ctx.fillStyle = dataArr[i].color;  
		        ctx.fillRect(posX, posY + 30 * i, width, height);  
		        ctx.moveTo(posX, posY + 30 * i);  
		        ctx.font = 'bold 16px 微软雅黑';    
		        ctx.fillStyle = dataArr[i].color;  
		        var percent = dataArr[i].text + "：" + (100 * dataArr[i].percent).toFixed(2) + "%";  //保留两位小数
		        ctx.fillText(percent, textX, textY + 30 * i);  
	        } 
		}
		
		//绘制饼状图
		function drawCircle(){
			var $circle = creatCanvas("canvas_temp",300,300); 
			var canvas = $circle[0];
		    var ctx = canvas.getContext("2d");  
		
		    var radius = canvas.height/2; 	//半径  
		    var ox = radius, oy = radius; //圆心  
		  
		    var startAngle = 0; //起始弧度  
		    var endAngle = 0;   //结束弧度  
		    for (var i = 0; i < dataArr.length; i++) {  
		        //绘制饼图  
		        endAngle = endAngle + dataArr[i].percent * Math.PI * 2; //结束弧度  
		        ctx.fillStyle = dataArr[i].color;  
		        ctx.beginPath();  
		        ctx.moveTo(ox, oy); //移动到到圆心  
		        ctx.arc(ox, oy, radius, startAngle, endAngle, false);  
		        ctx.closePath();  
		        ctx.fill();  
		        startAngle = endAngle; //设置起始弧度  
		    }  
		    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		    var circleObj = {"imgData":imgData,"width":canvas.width,"height":canvas.height};
		    return circleObj;
		}
		
		//创建画布
        function creatCanvas(canvasId,width,height){
			var jqObj = $("<canvas>").attr({"id":canvasId,"width":width,"height":height}).text("您的浏览器不支持canvas！");
			return jqObj;
		}
        
        _this.canvasId = canvasId;
        _this.getdataArr=function(){return dataArr};
        _this.setdataArr=function(data){dataArr=data};
        _this.drawCircle=function (data){_this.setdataArr(data);drawCircle();};
        
        return _this;
	}	
}(jQuery));