var task_list = [];
var $add_task=$(".add-task");
var $list =  $(".task-list");
init();


$add_task.on("submit",function(event){
	event.preventDefault(); //阻止默认事件
	var obj = {};
	obj.content = $add_task.find("input").eq(0).val();
	if(obj.content=="") return

	obj.status = 0;		//记录任务的状态 0表示未完成 1表示已完成
	add_task(obj);
	$add_task.find("input").eq(0).val(null);
})

//把对象push数组里面
function add_task(obj){
	task_list.push(obj);
	
	//把数据存储到浏览器
	store.set("task_list",task_list);
	init();
}

delect();

//初始化
function init(){
	$list[0].innerHTML="";
	if(store.get("task_list")!=null && store.get("task_list")[0]!=null){
		task_list = store.get("task_list");
	}
	$(".msg").remove();
	creatHtml();
	delect();
	completed();
	list_detail();
}

//绑定html
function bindHtml(data,index){
	var str =	'<li data-index="'+index+'"><input type="checkbox" class="completed" '+(data.status==1?'checked':'')+'><p class="content">'+data.content+'</p>'+
				'<div class="right"><span class="delete r-main">删除</span><span class="detail r-main">详细</span></div></li>'

	return $(str);			
}

//生成html
function creatHtml(){
	for(var index=0; index<task_list.length;index++){
		var $item = bindHtml(task_list[index],index);
		$list.prepend($item);
		alarm($item);
	}

}

//删除数据
function delect(){
	var $delBtn = $(".delete");
	$delBtn.each(function(index,ele){
		$(ele).click(function(){
			/*因为数据是prepend进生成li，所以第一个li对应最后一个数据
			故点击第一个li删除按钮应该移出最后一个数据*/
			task_list.splice(task_list.length -1 - index,1);
			//把数据存储到浏览器
			store.set("task_list",task_list);
			init();
		})
	})
}

//勾选按钮添加样式
function completed(){
	var $btn = $(".completed");
	var $aLi = $(".task-list li");
	$btn.each(function(index,ele){
		if(task_list!=null){
			if($(ele).is(':checked')){
					task_list[task_list.length-1-index].status=1;
					$aLi.eq(index).addClass("compelted");
				}else { 
					task_list[task_list.length-1-index].status=0;
					$aLi.eq(index).removeClass("compelted");
			}
		}
		$(ele).click(function(){
			if($(this).is(':checked')){
				task_list[task_list.length-1-index].status=1;
				var obj = task_list[task_list.length-1-index];
				task_list.splice(task_list.length-1-index,1);
				task_list.unshift(obj)
				store.set("task_list",task_list);
				$aLi.eq(index).addClass("compelted");
			}else {
				task_list[task_list.length-1-index].status=0;
				var obj = task_list[task_list.length-1-index];
				task_list.splice(task_list.length-1-index,1);
				task_list.push(obj)
				store.set("task_list",task_list);
				$aLi.eq(index).removeClass("compelted");
			}
			init();
		})
	})
}

/*---------------------------------详细 start-------------------------------------*/
//1.点击后 获取index
function list_detail(){
	$(".detail").click(function(){
		var index = $(this).parent().parent().data("index");
		add_frame(task_list[index],index);
	})
}

//2.生成弹框
function add_frame(data,index){
	var str  = '<div class="task-detail-mask"></div>'+
		 			'<div class="task-detail">'+
		     			'<form class="up-task">'+
		     				'<div class="box">'+
		     			     	'<h2 class="content">'+data.content+'</h2>'+
		     			     	'<input type="text" name="" value="">'+
		     				 '</div>'+
		        			'<div class="input-item">'+
		        			'<textarea>'+(data.desc || "")+'</textarea>'+
		        			'</div>'+
				        	'<div class="remind input-item">'+
				        		'<label for="b">提醒时间</label>'+
				        		'<input id="b" class="datetime" type="text" value="'+(data.time || "")+'">'+
				        	'</div>'+
				     	   '<div class="input-item">'+
				        		'<button>更新</button>'+
				        	'</div>'+
				        	'<div class="colse">X</div>'+
		     			'</form>'+
				 '</div>'

	$(".container").append(str);
	jQuery.datetimepicker.setLocale('ch')
	jQuery('.datetime').datetimepicker();
	submit(data,index);
	changeName(index);
	remove_frame();
}

//3.删除弹框
function remove_frame(){
	$(".task-detail-mask,.up-task .colse,.up-task .input-item button").click(function(){
		$(".task-detail-mask,.task-detail").remove();
	})
}

//详细提交
function submit(data,index){
	$(".up-task .input-item button").click(function(ev){
		ev.preventDefault();
		var newobj = {};
		newobj.content = data.content;
		newobj.status = data.status;
		newobj.desc = $(".up-task textarea").val();
		newobj.time = $(".up-task .datetime").val(); 
		task_list[index] = newobj;
		store.set("task_list",task_list);
		init();
	})
}

//双击修改名称
function changeName(index){
	var $content = $(".box .content");
	var $input = $(".box input");
	$content.dblclick(function(){
		$input.show();
		$input.focus();
		$input.blur(function(){
			$input.hide();
			if(!$input.val()) return;
			$content.text($input.val());
			task_list[index].content=$input.val();	
			store.set("task_list",task_list);
			init();
		})
		
	})

}

/*---------------------------------详细 end-------------------------------------*/


/*---------------------------------闹钟 start-------------------------------------*/
var timer = null;

function alarm(obj){
	 var index = $(obj[0]).data("index");
	 clearInterval(obj[0].timer);
	 obj[0].timer = setInterval(function(){
	 	var curTime = new Date().getTime();
	 	if(task_list[index].status || !task_list[index].time || task_list[index].off){
	 		clearInterval(obj[0].timer);
	 		return;
	 	}else {
	 		var alarmTime = (new Date(task_list[index].time)).getTime();
	 		if(alarmTime - curTime <= 0){
	 			show_alert(task_list[index]);
	 			clearInterval(obj[0].timer); 			
	 		}
	 	}
	 },2000)
}

//绑定提示信息HTMl
function createMsg(obj){
	var str = 	'<div class="msg">'+
		    '<div class="msg-content">'+obj.content+'</div>'+
		    '<div class="msg-btn">我知道了</div> '+
			'</div>'

	$("body").prepend(str);
}

function show_alert(obj){
	console.log($(obj)+"1")
	createMsg(obj);
	document.querySelector("#music").play();

	$(".msg-btn").click(function(){
		$(this).parent().remove();
		obj.off=true;
		store.set("task_list",task_list);

	})
}


/*---------------------------------闹钟 end-------------------------------------*/