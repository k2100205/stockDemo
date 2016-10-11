
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
 <!-- Wijmo CSS（3）-->
    <link href="../js/wijmo/Themes/aristo/jquery-wijmo.css" rel="stylesheet" type="text/css" />

    <!-- SpreadJS（4） -->
    <script src="../js/wijmo/js/gcspread.sheets.all.9.40.20161.0.min.js" type="text/javascript"></script>

    <!-- SpreadJS CSS（5）-->
    <link href="../js/wijmo/css/jquery.wijmo-pro.3.20162.103.css" rel="stylesheet" type="text/css" />



<style type="text/css">
table {
	border-collapse: collapse;
	border: solid #000 1px;

}

th {
	border: solid #000 1px;
}

td {
	border: solid #000 1px;
}
</style>


</head>

<body>
<div id="wijspread1" style="height: 500px; border: 1px solid gray"/>
  <script id="scriptInit" type="text/javascript">
        $(document).ready( $(function () {
            // SpreadJS 初始化
            $("#wijspread1").wijspread();
        })
        );
    </script>

</body>

</html>
