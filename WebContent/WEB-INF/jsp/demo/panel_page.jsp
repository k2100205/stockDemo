<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="demo">
    <meta name="author" content="cjq">
    <title>demo</title>
    
     <script type="text/javascript" src="../js/jquery-3.0.0.js"></script>
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/icon.css">
   <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/demo/demo.css">
    <script type="text/javascript" src="../js/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>


</head>

<body>

	<div class="easyui-accordion" >

		<c:forEach var="s" items="${list}">   
        <div title=" ${s.title}" >
			<div class="easyui-panel" >
		<ul id="${s.panelNum}" class='panelTree'></ul>
		${s.panelNum}
	   </div>
	   </div>
             
             
            </c:forEach>  
	</div>


</body>
    <div id="dc" class="easyui-menu" style="width:120px;">
        <div>插入新菜单</div>
        <div>删除当前菜单</div>
        <div>修改菜单名字</div>
    </div>

 <script type="text/javascript" >
 if (window.Event) 
	 document.captureEvents(Event.MOUSEUP); 
	 function nocontextmenu(){ 
	 event.cancelBubble = true 
	 event.returnValue = false; 
	 return false; 
	 } 

	 function norightclick(e){ 
	 if (window.Event){ 
	   if (e.which == 2 || e.which == 3) 
	   return false; 
	 } 
	 else 
	   if (event.button == 2 || event.button == 3){ 
	    event.cancelBubble = true 
	    event.returnValue = false; 
	    return false; 
	   } 
	 } 
	 document.oncontextmenu = nocontextmenu; // for IE5+ 
	 document.onmousedown = norightclick; // for all others 

 $(".easyui-accordion").bind('contextmenu',function(e){
     $('#dc').menu('show', {left: e.pageX,top: e.pageY});
 });  

 
 function showcontent(language){
	 $('#content').html('Introduction to ' + language + ' language');
	 }

 $(function() {
	 $(".panelTree").each(function(){
		 var panelNum = $(this).eq(0).attr('id');
         $(this).tree({
 	    	url:"tree/node?panelNum="+panelNum,
	    	 onClick: function (node) {
	    		 var children=$(this).tree('getChildren',node.target);
	 
	    		 
	    		 if($(this).tree('isLeaf',node.target)){ 
	    		     $.ajax({
	    			        url: 'tree/node?pid='+node.id,
	    			        dataType: 'json',
	    			        success: function(node){
	    		     		$("#"+panelNum).tree('append', {
	    		     			        parent:$("#"+panelNum).tree('getSelected').target,
	    		     					data:node
	    		     				});
	    			        }
	    			        });
	    		 }
                   if(node.url=="#"||node.url==null){
                   	return;
                   }
                   
                   if($("#tb").tabs("exists",node.text)){
                       $("#tb").tabs("select",node.text);    
                    }else{
                   
	    		    $('#tb').tabs('add', {
	    	            title:  node.text,
	    	            content: '<iframe  src='+node.url+' style="width:100%;height:100%;overflow-x: hidden; overflow-y: hidden;"></iframe>', 
	    	            closable: true

	    	        });  
                    }
 
	    	 }		            
	    });
		});

	 
	 


 

	});

 </script>
</html>
