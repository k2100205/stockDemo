
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
<meta http-equiv="Access-Control-Allow-Origin" content="*">
<meta http-equiv=Cache-Control content=no-cache /> 
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


</head>

<body>

  <table id="feedback" ></table>
    <div id="dlg" >
       <form id="ff" method="post">
   <div>
		<label for="name">股票名称:</label>
	<input class="easyui-validatebox" type="text" name="procStock.stockName" data-options="required:true" />
  </div>
  <div>
	<label for="num">股票代码:</label>
		<input class="easyui-validatebox" type="text" name="procStock.stockNum" data-options="required:true" />
   </div>
  <div>
	<label for="email">股票市场:</label>
		<input class="easyui-validatebox" type="text" name="procStock.stockMarket" data-options="required:true" />
   </div>
</form>
    </div>
 <div id="gif" hidden="true" style="width:900px;height: 390;overflow: hidden;">
     <div  id='gifdiv' style="float:left;width: 390;overflow: hidden;"><iframe id="gifUrl" src='#' style="float:left;width: 600px;height: 390px"></iframe>

     
     </div> 
     <div  id='msgdiv'>
     <center><h1><div id='stPrice' ></div></h1></center>
      <center> <h3>
      <table >
      <tr>
       <td id='sub' style="text-align: center;"></td>
       <td></td>
       <td></td>
       <td id='per'style="text-align: center;"></td>
      </tr>
      </table>
      
      </h3>
      </center>
     <table>
   
    <tr>
    <td class='text-lable'>今日开盘价</td>
    <td id='stOpen'></td>
    <td class='text-lable'>昨日收盘价</td>
    <td id='stClose'></td>


    </tr>
            <tr>

    <td id=''></td>
    </tr>
        <tr>
     <td class='text-lable'>今日最高价</td>
    <td id='stHigh'></td>
    <td class='text-lable'>今日最低价</td>
    <td id='stLow'></td>


    </tr>
                <tr>

    <td id=''></td>
    </tr>
            <tr>

    <td id=''></td>
    </tr>
         <tr>
    <td class='text-lable' colspan=2>成交金额</td>
    <td id='stSum'></td>
    </tr>
         <tr>

    <td class='text-lable' colspan=2>成交的股票数</td>
    <td id='stVol'></td>
    </tr>
                 <tr>

    <td id=''></td>
    </tr>
                     <tr>

    <td id=''></td>
    </tr>
     
         <tr>
        <td class='text-lable'>买五价</td>
    <td id='stB5'></td>
        <td class='text-lable'>买五量</td>
    <td id='stBV5'></td>
    </tr>
         <tr>
    <td class='text-lable'>买四价</td>
    <td id='stB4'></td>
    <td class='text-lable'>买四量</td>
    <td id='stBV4'></td>
    </tr>
        <tr>
     <td class='text-lable'>买三价</td>
    <td id='stB3'></td>
        <td class='text-lable'>买三量</td>
    <td id='stBV3'></td>
    </tr>
    
          <tr>
     <td class='text-lable'>买二价</td>
     <td id='stB2'></td>
    <td class='text-lable'>买二量</td>
    <td id='stBV2'></td>
      </tr>
    <tr>
    <td class='text-lable'>买一价</td>
    <td id='stB1'></td>
    <td class='text-lable'>买一量</td>
    <td id='stBV1'></td>
    </tr>


    
        <tr>

    <td id=''></td>
    </tr>
                     <tr>

    <td id=''></td>
    </tr>
                     
    
    <tr>
    <td class='text-lable'>卖一价</td>
    <td  id='stS1'></td>
    <td class='text-lable'>卖一量</td>
    <td id='stSV1'></td>
    </tr>
    <tr>
        <td class='text-lable'>卖二价</td>
    <td id='stS2'></td>
        <td class='text-lable'>卖二量</td>
    <td id='stSV2'></td>
    
    </tr>
    
    <tr>
    <td class='text-lable'>卖三价</td>
    <td id='stS3'></td>
    <td class='text-lable'>卖三量</td>
    <td id='stSV3'></td>
    </tr>
        <tr>
    <td class='text-lable'>卖四价</td>
    <td id='stS4'></td>
    <td class='text-lable'>卖四量</td>
    <td id='stSV4'></td>


    </tr>
            <tr>
    <td class='text-lable'>卖五价</td>
    <td id='stS5'></td>
    <td class='text-lable'>卖五量</td>
    <td id='stSV5'></td>


    </tr>
         

  
</table>

     </div>
    </div>



    <div id="ufdlg" >
       <form id="uf" method="post">
   <div>
		<label for="name">股票名称:</label>
	<input id="stockNum" class="easyui-validatebox" type="text" name="procStockUpd.stockNum" data-options="required:true" hidden="true"/>
		
	<input class="easyui-validatebox" type="text" name="procStockUpd.stockName" data-options="required:true" />
  </div>

</form>
    </div>
</body>
<script type="text/javascript">
var stock;
var stock_msg

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
	
	$('#gif').dialog({
		   title: '走势图',
		    closed: true,
	        cache: false,
		    modal: true,
		    url:'#',
		    toolbar: [{
                text: '分时图',
                handler: function () {
                	$('#gifdiv').show();
                	$('#gifUrl').attr("src","http://image.sinajs.cn/newchart/min/n/"+stock+".gif");
            		$('#gifUrl').attr('src', $('#gifUrl').attr('src'));
                }

            },
            '-', 
            {
                text: '日K线',
                handler: function () {
                	$('#gifdiv').show();
                	$('#gifUrl').attr("src","http://image.sinajs.cn/newchart/daily/n/"+stock+".gif");
            		$('#gifUrl').attr('src', $('#gifUrl').attr('src'));
                }
            },
            '-', 
                {
                    text: '周K线',
                    handler: function () {
                    	$('#gifdiv').show();
                    	$('#gifUrl').attr("src","http://image.sinajs.cn/newchart/weekly/n/"+stock+".gif");
                		$('#gifUrl').attr('src', $('#gifUrl').attr('src'));
                    }
            },
            '-', 
            {
                text: '月K线',
                handler: function () {
                	$('#gifdiv').show();
                	$('#gifUrl').attr("src","http://image.sinajs.cn/newchart/monthly/n/"+stock+".gif");
            		$('#gifUrl').attr('src', $('#gifUrl').attr('src'));
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
        title : "股票池",
        striped : true,
        singleSelect : false,
        loadMsg : "正在加载，请稍等...",
        url : "../stock/stockVO",
        pagination : true,
        rownumbers : true,
        fitColumns:true,
        idField:"stockId",
        onClickRow:function(rowIndex,rowData){
               	
        	var arr = rowData.stockNum.split(".");
        	var str;
        	if(arr[1]=='ss'){
        		str="sh"+arr[0];
        	}
        	if(arr[1]=='sz'){
        		str="sz"+arr[0];
        	}
        	$('#gifdiv').show();
        	$('#gifUrl').attr("src","http://image.sinajs.cn/newchart/min/n/"+str+".gif");
           	$('#gif').dialog('open'); 
           	stock=str;
           	myInterval();
           },
        columns:[[
        { field:'ck',checkbox:true },
        {title:"股票名",field:"stockName"},
        {title:"股票代码",field:"stockNum"},
        {title:"地址",field:"stockMarket"},
        {title:"同步状态",field:"syncStatus"},
        {title:"同步时间",field:"syncTime"},
        {title:"今日开盘价",field:"openPrice",width:150},
        {title:"昨日收盘价",field:"oldPrice",width:150},
        {title:"今日最高价",field:"highPrice",width:150},   
        {title:"今日最低价",field:"lowPrice",width:150},
        {title:"当前价",field:"price",width:150},
        {title:"成交量",field:"volme",width:150},
        {field:"stockId,",hidden:true}
        ]],
	    toolbar:[{ text:'新增股票',iconCls:'icon-add',handler:function(){  
	    	$('#dlg').dialog('open');
	                    }  
		                },
		         { text:'初始化',iconCls:'icon-large-shapes',handler:function(){  
		        	 sync();
                        }  
		                },
				 { text:'刷新',iconCls:'icon-reload',handler:function(){  
					 location.reload();
		                        }  
				      },
				 { text:'删除',iconCls:'icon-remove',handler:function(){  
					 stock_Del();
				                        }  
						      },
				 { text:'修改',iconCls:'icon-edit',handler:function(){  
					
					 var rowIndex = $('#feedback').datagrid('getSelected');
					 $('#stockNum').val(rowIndex.stockNum);
						$('#ufdlg').dialog('open');
						                        }  
						},
						 { text:'同步',iconCls:'icon-reload',handler:function(){  
							 sync_stock();
						                        }  
								      }
		               ],    
		               pageSize:10,
		               pageList:[10,20,30,40]
		           });  

});

function  sync(){
	if(confirm("是否同步勾选的股票")){
		var checkedItems = $('#feedback').datagrid('getChecked');
		if(checkedItems.length==0){
			alert('请至少选中一个');
			return;
		}
		var datas = [];
		$.each(checkedItems, function(index, item){
			datas.push(item.stockId);
			datas.push(item.stockNum);
		});   
		$.ajax({
	        url: '../stock/sync',
	        method: 'POST',
	        data: {data: datas},
	        dataType: 'json',
	        success: function(data){
	        	 alert(data.msgData);
	        },
	        error:function(e)
	        {
	        	 alert("发生错误！");
	        }

	    });

		}
}
function  sync_stock(){
	if(confirm("是否同步勾选的股票")){
		var checkedItems = $('#feedback').datagrid('getChecked');
		if(checkedItems.length==0){
			alert('请至少选中一个');
			return;
		}
		var datas = [];
		$.each(checkedItems, function(index, item){
			datas.push(item.stockId);
			datas.push(item.stockNum);
		});   
		$.ajax({
	        url: '../stock/syncStock',
	        method: 'POST',
	        data: {data: datas},
	        dataType: 'json',
	        success: function(data){
	        	 alert(data.msgData);
	        	 location.reload();
	        },
	        error:function(e)
	        {
	        	 alert("发生错误！");
	        }

	    });

		}
}


function  stock_ins(){
	$.ajax({
        url: '../stock/stockIns',
        method: 'POST',
        data: $('#ff').serialize(),
        dataType: 'json',
        success: function(data){
        	 alert(data.msgData);
        	 $("#ff").form('clear');
			 location.reload();

        },
        error:function(e)
        {
        	 alert("发生错误！");
        	 $("#ff").form('clear');
        }

    });
	
}

function  stock_upd(){
	alert( $('#uf').serialize());
	$.ajax({
        url: '../stock/stockUpd',
        method: 'POST',
        data: $('#uf').serialize(),
        dataType: 'json',
        success: function(data){
        	 alert(data.msgData);
        	 $("#uf").form('clear');
			 location.reload();

        },
        error:function(e)
        {
        	 alert("发生错误！");
        	 $("#uf").form('clear');
        }

    });
	
}

function  stock_Del(){
	if(confirm("是否删除勾选的股票")){
		var checkedItems = $('#feedback').datagrid('getChecked');
		if(checkedItems.length==0){
			alert('请至少选中一个');
			return;
		}
		var datas = [];
		$.each(checkedItems, function(index, item){
			datas.push(item.stockNum);
		});   
		$.ajax({
	        url: '../stock/stockDel',
	        method: 'POST',
	        data: {data: datas},
	        dataType: 'json',
	        success: function(data){
	        	 alert(data.msgData);
	        	 location.reload();
	        },
	        error:function(e)
	        {
	        	 alert("发生错误！");
	        }

	    });
	}
 
	
}
function myInterval()
{
	$('#gifUrl').attr('src', $('#gifUrl').attr('src'));

	
	var rows = $("#feedback").datagrid("getRows"); //这段代码是获取当前页的所有行。
	for(var i=0;i<rows.length;i++)
	{
	//获取每一行的数据

	var arr = rows[i].stockNum.split(".");
	var str;
	if(arr[1]=='ss'){
		str="sh"+arr[0];
	}
	if(arr[1]=='sz'){
		str="sz"+arr[0];
	}
	var hq_str;
	var elements;
	var rowIndex=i;
	$.ajax({
	    url:"http://hq.sinajs.cn/list="+stock,
	    dataType:"html",
	    cache:"true",
	    async: false,
	    type:"post",
	    success:function(data){
	    	var stocks = data.split('=');
	    	var em=stocks[1].split(',');
	    	
	    	//$("#stName").html(em[0].substr(1, em[0].length));
	    	//$("#stNum").html(str);
	    	//$("#stDate").html(em[30]);
	    	//$("#stTime").html(em[31]);
	    	$("#stOpen").html(em[1]);
	    	$("#stClose").html(em[2]);
	    	$("#stHigh").html(em[4]);
	    	$("#stPrice").html(em[3]);
	      	$("#stLow").html(em[5]);
	     // 	$("#stBuy").html(em[6]);
	     // 	$("#stSale").html(em[7]);
	      	$("#stVol").html(em[8]);
	    	$("#stSum").html(em[9]);
	    	$("#stB1").html(em[11]);
	    	$("#stBV1").html(em[10]);
	    	$("#stBV2").html(em[12]);
	    	$("#stB2").html(em[13]);
	    	$("#stBV3").html(em[14]);
	    	$("#stB3").html(em[15]);
	    	$("#stBV4").html(em[16]);
	    	$("#stB4").html(em[17]);
	    	$("#stBV5").html(em[18]);
	    	$("#stB5").html(em[19]);
	    	$("#stSV1").html(em[20]);
	    	$("#stS1").html(em[21]);
	    	$("#stSV2").html(em[22]);
	    	$("#stS2").html(em[23]);
	    	$("#stSV3").html(em[24]);
	    	$("#stS3").html(em[25]);
	    	$("#stSV4").html(em[26]);
	    	$("#stS4").html(em[27]);
	    	$("#stSV5").html(em[28]);
	    	$("#stS5").html(em[29]);
	    	var subs=parseFloat(	$("#stPrice").html()) - parseFloat(	$("#stClose").html());
	    	var pers=parseFloat(	subs) / parseFloat(	$("#stClose").html());
	    	var de;
	    	if(pers>0){
	    		de=(pers*100).toFixed(2)+"%";
	    	}else{
	    		de=-(pers*100).toFixed(2)+"%";
	    	}
	    	$("#sub").html(subs.toFixed(2));
	    	$("#per").html(de);
	    	
	    	
	    	if(pers>0){
                $("#per").css('color','#dd0000');

	    	}
	    	if(pers<0){
                $("#per").css('color','#00dd00');

	    	}
	    	
	    	if(subs>0){
                $("#sub").css('color','#dd0000');

	    	}
	    	if(subs<0){
                $("#sub").css('color','#00dd00');

	    	}
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stPrice").html())){
                $("#stPrice").css('color','#dd0000');

            }
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stClose").html())){
                $("#stPrice").css('color','#00dd00');

            }	   
            
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stB1").html())){
                $("#stB1").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stB1").html())){
                $("#stB1").css('color','#00dd00');

            }	
            
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stB2").html())){
                $("#stB2").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stB2").html())){
                $("#stB2").css('color','#00dd00');

            }	
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stB3").html())){
                $("#stB3").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stB3").html())){
                $("#stB3").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stB4").html())){
                $("#stB4").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stB4").html())){
                $("#stB4").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stB5").html())){
                $("#stB5").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stB5").html())){
                $("#stB5").css('color','#00dd00');

            }
            
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stS1").html())){
                $("#stS1").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stS1").html())){
                $("#stS1").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stS2").html())){
                $("#stS2").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stS2").html())){
                $("#stS2").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stS3").html())){
                $("#stS3").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stS3").html())){
                $("#stS3").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stS4").html())){
                $("#stS4").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stS4").html())){
                $("#stS4").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stS5").html())){
                $("#stS5").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stS5").html())){
                $("#stS5").css('color','#00dd00');

            }
            
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stHigh").html())){
                $("#stHigh").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stHigh").html())){
                $("#stHigh").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stLow").html())){
                $("#stLow").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stLow").html())){
                $("#stLow").css('color','#00dd00');

            }
            if (parseFloat(	$("#stClose").html()) < parseFloat(	$("#stOpen").html())){
                $("#stOpen").css('color','#dd0000');

            }
            
            if (parseFloat(	$("#stClose").html()) > parseFloat($("#stOpen").html())){
                $("#stOpen").css('color','#00dd00');

            }
	    }
            
	    });
	    	
	
	}
	
 }
function myInterval1()
{
	
	var rows = $('#feedback').datagrid("getRows");
	for(var i=0; i<rows.length; i++){
    	var arr = rows[i].stockNum.split(".");
    	var str;
    	if(arr[1]=='ss'){
    		str="sh"+arr[0];
    	}
    	if(arr[1]=='sz'){
    		str="sz"+arr[0];
    	}
		
		
			$.ajax({
			    url:"http://hq.sinajs.cn/list="+str,
			    dataType:"html",
			    cache:"true",
			    async: false,
			    type:"post",
			    success:function(data){
			    	var stocks = data.split('=');
			    	var em=stocks[1].split(',');
			    	$('#feedback').datagrid('updateRow',{index:i,row:{
			    		openPrice:em[1],
			    		oldPrice:em[2],
			    		highPrice:em[4],
			    		lowPrice:em[5],
			    		price:em[3],
			    		volme:em[8]
			    	}})
			    	 var trs = $('#feedback').prev().find('div.datagrid-body').find('tr');
			    	tr2 = trs[i];
			    	    if (parseFloat(tr2.cells[10].firstChild.innerHTML) > parseFloat(tr2.cells[7].firstChild.innerHTML)){
			    	        tr2.cells[10].style.cssText = 'color:#dd0000';
			    	    }
			    	    if (parseFloat(tr2.cells[10].firstChild.innerHTML) < parseFloat(tr2.cells[7].firstChild.innerHTML)){
			    	        tr2.cells[10].style.cssText = 'color:#00dd00';
			    	    }


			    	}


			    	});
			    	
			
	}


}
 
setInterval('myInterval()',5000);//1000为1秒钟  
setInterval('myInterval1()',5000);//1000为1秒钟  

</script>
</html>
