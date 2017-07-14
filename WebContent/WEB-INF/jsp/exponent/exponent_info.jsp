
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<% response.setHeader("Pragma", "No-cache"); response.setHeader("Cache-Control", "no-cache"); response.setDateHeader("Expires", 0); %>

<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="demo">
<meta name="author" content="cjq">
<meta http-equiv="Access-Control-Allow-Origin" content="*">
<title>demo</title>


     <script type="text/javascript" src="../js/jquery-3.0.0.js"></script>
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/icon.css">
   <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/demo/demo.css">
    <script type="text/javascript" src="../js/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>

<style type="text/css">


th {
	border: #000 1px;
}

td {
	border:#000 1px;
}
.text-lable{
	background-color:#E7F0FF;
}
</style>

 <script type="text/javascript">



            //查询
            function sync_50() {

                $.ajax({
        	        url: '../exponent/sync_stockAll',
        	        dataType: 'json',
        	        success: function(data){
       	        	 alert(data.msgData);

        	        }
                });
                
            }
            //载入图表
        
        </script>

</head>

<body>
<button onclick="sync_50()">全部股票</button>
</body>
</html>
