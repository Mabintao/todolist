function add_task(t){task_list.push(t),store.set("task_list",task_list),init()}function init(){$list[0].innerHTML="",null!=store.get("task_list")&&null!=store.get("task_list")[0]&&(task_list=store.get("task_list")),$(".msg").remove(),creatHtml(),delect(),completed(),list_detail()}function bindHtml(t,s){var e='<li data-index="'+s+'"><input type="checkbox" class="completed" '+(1==t.status?"checked":"")+'><p class="content">'+t.content+'</p><div class="right"><span class="delete r-main">删除</span><span class="detail r-main">详细</span></div></li>';return $(e)}function creatHtml(){for(var t=0;t<task_list.length;t++){var s=bindHtml(task_list[t],t);$list.prepend(s),alarm(s)}}function delect(){$(".delete").each(function(t,s){$(s).click(function(){task_list.splice(task_list.length-1-t,1),store.set("task_list",task_list),init()})})}function completed(){var t=$(".completed"),s=$(".task-list li");t.each(function(t,e){null!=task_list&&($(e).is(":checked")?(task_list[task_list.length-1-t].status=1,s.eq(t).addClass("compelted")):(task_list[task_list.length-1-t].status=0,s.eq(t).removeClass("compelted"))),$(e).click(function(){if($(this).is(":checked")){task_list[task_list.length-1-t].status=1;e=task_list[task_list.length-1-t];task_list.splice(task_list.length-1-t,1),task_list.unshift(e),store.set("task_list",task_list),s.eq(t).addClass("compelted")}else{task_list[task_list.length-1-t].status=0;var e=task_list[task_list.length-1-t];task_list.splice(task_list.length-1-t,1),task_list.push(e),store.set("task_list",task_list),s.eq(t).removeClass("compelted")}init()})})}function list_detail(){$(".detail").click(function(){var t=$(this).parent().parent().data("index");add_frame(task_list[t],t)})}function add_frame(t,s){var e='<div class="task-detail-mask"></div><div class="task-detail"><form class="up-task"><div class="box"><h2 class="content">'+t.content+'</h2><input type="text" name="" value=""></div><div class="input-item"><textarea>'+(t.desc||"")+'</textarea></div><div class="remind input-item"><label for="b">提醒时间</label><input id="b" class="datetime" type="text" value="'+(t.time||"")+'"></div><div class="input-item"><button>更新</button></div><div class="colse">X</div></form></div>';$(".container").append(e),jQuery.datetimepicker.setLocale("ch"),jQuery(".datetime").datetimepicker(),submit(t,s),changeName(s),remove_frame()}function remove_frame(){$(".task-detail-mask,.up-task .colse,.up-task .input-item button").click(function(){$(".task-detail-mask,.task-detail").remove()})}function submit(t,s){$(".up-task .input-item button").click(function(e){e.preventDefault();var a={};a.content=t.content,a.status=t.status,a.desc=$(".up-task textarea").val(),a.time=$(".up-task .datetime").val(),task_list[s]=a,store.set("task_list",task_list),init()})}function changeName(t){var s=$(".box .content"),e=$(".box input");s.dblclick(function(){e.show(),e.focus(),e.blur(function(){e.hide(),e.val()&&(s.text(e.val()),task_list[t].content=e.val(),store.set("task_list",task_list),init())})})}function alarm(t){var s=$(t[0]).data("index");clearInterval(t[0].timer),t[0].timer=setInterval(function(){var e=(new Date).getTime();task_list[s].status||!task_list[s].time||task_list[s].off?clearInterval(t[0].timer):new Date(task_list[s].time).getTime()-e<=0&&(show_alert(task_list[s]),clearInterval(t[0].timer))},2e3)}function createMsg(t){var s='<div class="msg"><div class="msg-content">'+t.content+'</div><div class="msg-btn">我知道了</div> </div>';$("body").prepend(s)}function show_alert(t){console.log($(t)+"1"),createMsg(t),document.querySelector("#music").play(),$(".msg-btn").click(function(){$(this).parent().remove(),t.off=!0,store.set("task_list",task_list)})}var task_list=[],$add_task=$(".add-task"),$list=$(".task-list");init(),$add_task.on("submit",function(t){t.preventDefault();var s={};s.content=$add_task.find("input").eq(0).val(),""!=s.content&&(s.status=0,add_task(s),$add_task.find("input").eq(0).val(null))}),delect();var timer=null;