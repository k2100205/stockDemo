
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

  <table id="feedback" ></table>


<div id="tb" >
		<label for="name">股票名称:</label>
	<input id="stockName" class="easyui-validatebox" type="text" name="stockName" />
	<a href="#" id="btn" iconCls="icon-search" onclick="doSearch()">查询</a>


		</div>

</body>
<script type="text/javascript">
$(document).ready(function() {
	$('#dlg').dialog({
		   title: '新增股票',
		    closed: true,
	        cache: false,
		    modal: true,
		    buttons:[{
		    					text:'提交',
		    				handler:function(){
		    					stock_ins();
		    					$('#dlg').dialog('close');
		    				}
		    				},{
		    					text:'取消',
		    				handler:function(){
		    					 $("#ff").form('clear');
		    					 $('#dlg').dialog('close');
		    				}
		    			}]

		});
	$('#ufdlg').dialog({
		   title: '修改股票名称',
		    closed: true,
	        cache: false,
		    modal: true,
		    buttons:[{
		    					text:'提交',
		    				handler:function(){
		    					stock_upd();
		    					$('#ufdlg').dialog('close');
		    				}
		    				},{
		    					text:'取消',
		    				handler:function(){
		    					 $("#uf").form('clear');
		    					 $('#ufdlg').dialog('close');
		    				}
		    			}]

		});

	$('#dlg').dialog('close');
	$('#feedback').datagrid({
        title : "股票历史数据",
        striped : true,
        singleSelect : false,
        loadMsg : "正在加载，请稍等...",
        url : "../stock/stockHis",
        pagination : true,
        rownumbers : true,
        idField:"stockId",
        columns:[[
        { field:'ck',checkbox:true },
        {title:"股票名",field:"stockName"},
        {title:"股票代码",field:"stockNum"},
        {title:"地址",field:"stockMarket"},
        {title:"日期",field:"date",formatter: formatDatebox},
        {title:"开盘价",field:"openPrice"},
        {title:"收盘价",field:"closePrice"},
        {title:"最高价",field:"highPrice"},
        {title:"最低价",field:"lowPrice"},
        {title:"收盘调整",field:"adjClose"},
        {title:"交易量",field:"volume"}
        ]],		       
        toolbar: '#tb',        
		pageSize:10,
		pageList:[10,20,30,40]
		           });  
	$('#btn').linkbutton({
		    plain:true
		});

});

function doSearch(){
$('#feedback').datagrid('load',{
     	stockName: $('#stockName').val()
		});

}

	

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
function formatDatebox(value) {
    if (value == null || value == '') {
        return '';
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else {
        dt = new Date(value);
    }

    return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(上述插件实现)
}
</script>
</html>
