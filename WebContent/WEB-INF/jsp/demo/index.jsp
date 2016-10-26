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
    

    
     <script type="text/javascript" src="js/jquery-3.0.0.js"></script>
         <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.4.5/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.4.5/themes/default/easyui.css">

   <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.4.5/demo/demo.css">
    <script type="text/javascript" src="js/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>


</head>

<body>
<div class="easyui-layout" style="width:100%;height:95%;" data-options="fit:true">>
	<div region="west" split="true" title="导航栏" style="width:200px;">
	<div class="easyui-accordion" >

		<c:forEach var="s" items="${list}">   
        <div title=" ${s.title}" >
			<div class="easyui-panel" >
		<ul id="${s.panelNum}" class='panelTree'></ul>
	   </div>
	   </div>
             
             
            </c:forEach>  
	</div>
	</div>
    <div  id="tb" class="easyui-tabs" data-options="region:'center'" style="background:#eee;overflow-x: hidden; overflow-y: hidden;">
     
            <div title="首页" style="padding:20px;display:none;">   
         
            </div>    

    </div>  
</div>


</body>
 <script type="text/javascript" >
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
