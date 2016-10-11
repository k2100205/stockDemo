
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>ECharts</title>
     <script type="text/javascript" src="../js/jquery-3.0.0.js"></script>
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/themes/icon.css">
   <link rel="stylesheet" type="text/css" href="../js/jquery-easyui-1.4.5/demo/demo.css">
    <script type="text/javascript" src="../js/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>
</head>
<body>
	<div id="p" class="easyui-panel" title="条件栏" style="width:97%;height:55px;">
       <form id="uf" method="post">
   <div>
		<label for="name">股票名称:</label>
	<input class="easyui-validatebox" type="text" name="stockName"  />
			<label for="name">日期选择</label>
	<input class="easyui-datebox" data-options="sharedCalendar:'#cc'" name="startDate"  />
			<label for="name">-</label>
	<input class="easyui-datebox" data-options="sharedCalendar:'#cc'" name="endDate"  />
	<a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" style="width:80px" onclick="loadDrugs()">Search</a>
	<div id="cc" class="easyui-calendar"></div>
  </div>

</form>
   </div>

  

</form>
	</div>

    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="psLine" style="height:400px"></div>
    <div id="psLine1" style="height:200px"></div>
    
    <!-- ECharts单文件引入 -->
    <script src="../js/echarts-2.2.7/build/dist/echarts-all.js"></script>
    <script type="text/javascript">

            //图表
            var psLineChar = echarts.init(document.getElementById('psLine'));
            var psLineChar1 = echarts.init(document.getElementById('psLine1'));

            //查询
            function loadDrugs() {
                psLineChar.clear();
                psLineChar.showLoading({text: '正在努力的读取数据中...'});
                $.ajax({
        	        url: '../stock_charts/info',
        	        data: $('#uf').serialize(),
        	        method: 'POST',
        	        dataType: 'json',
        	        success: function(data){
                        psLineChar.setOption(data[0]);
                        psLineChar1.setOption(data[1]);
                        psLineChar.connect(psLineChar1);
                        psLineChar.hideLoading();
        	        }
                });
                
            }
            //载入图表
        
        </script>
</body>
