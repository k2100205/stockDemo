package cn.cjq.action;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jws.WebResult;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;



import cn.cjq.Job.InitStockHisJob;
import cn.cjq.api.YahooStock;
import cn.cjq.bean.DataGrid;
import cn.cjq.bean.DataMsg;
import cn.cjq.bean.ProcStock;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockHisVO;
import cn.cjq.bean.StockVO;
import cn.cjq.charts.util.echarts.Legend;
import cn.cjq.charts.util.echarts.Option;
import cn.cjq.charts.util.echarts.Title;
import cn.cjq.charts.util.echarts.Toolbox;
import cn.cjq.charts.util.echarts.Tooltip;
import cn.cjq.charts.util.echarts.axis.AxisLabel;
import cn.cjq.charts.util.echarts.axis.AxisTick;
import cn.cjq.charts.util.echarts.axis.CategoryAxis;
import cn.cjq.charts.util.echarts.axis.ValueAxis;

import cn.cjq.charts.util.echarts.code.Trigger;
import cn.cjq.charts.util.echarts.DataZoom;
import cn.cjq.charts.util.echarts.series.Bar;
import cn.cjq.charts.util.echarts.series.K;
import cn.cjq.charts.util.echarts.series.Line;
import cn.cjq.service.StockHisService;
import cn.cjq.service.StockService;

@Controller
public class StockChartsController{
	
	@Autowired
	StockService stockService;
	@Autowired
	StockHisService stockHisService;
	@Autowired
	YahooStock yahooStock;
	Map<String, Object> para=new HashMap<String, Object>();
//	 跳转股票信息页面
	@RequestMapping(value = "stock_charts/info", method = RequestMethod.GET)
	public ModelAndView indexStockCharts(HttpServletRequest request) {
		return new ModelAndView("stock/stock_echarts",null);   
	}
	
	@RequestMapping(value = "stock_charts/info")
	@ResponseBody
	public Option[] info(StockHisVO sh) throws Exception {
		sh.setStockName(sh.getStockName());
		para.put("TABLE", sh);
		para.put("ORDER_BY", "date asc");
	    List<StockHisVO> results= stockHisService.find(para);
		   Option option = new Option();
		   option.title(sh.getStockName());
		   Tooltip tooltip=new Tooltip();
		   tooltip.trigger(Trigger.axis);
		   option.tooltip(tooltip);
		   Legend legend=new Legend();
		   legend.data("k线图");
		   legend.data("5天移动平均线");
		   legend.data("10天移动平均线");
		   legend.data("20天移动平均线");
		   legend.data("60天移动平均线");
		   legend.data("120天移动平均线");
		   legend.data("250天移动平均线");
		   option.legend(legend);
		   DataZoom dataZoom=new DataZoom();
		   dataZoom.start(70);
		   dataZoom.end(100);
		   dataZoom.realtime(true);
		   dataZoom.show(true);
	
		   option.dataZoom(dataZoom);
		    CategoryAxis xAxis = new CategoryAxis();
		    xAxis.boundaryGap(true);
		    for(StockHisVO vo:results){
		    	xAxis.data(vo.getDate().toString().substring(0, 10));
		    }
		    
		    option.xAxis(xAxis);
		    ValueAxis yAxis = new ValueAxis();
		    yAxis.scale(true);
		    option.yAxis(yAxis);
		    K k = new K();
		    k.name("k线图");
		    for(StockHisVO vo:results){
		    	ArrayList<Double> data=new ArrayList<Double>();
		    	data.add(vo.getOpenPrice());
		    	data.add(vo.getClosePrice());
		    	data.add(vo.getLowPrice());
		    	data.add(vo.getHighPrice());
		    	k.data(data);
		    }
		    Line line5 = new Line();
		    line5.name("5天移动平均线");
		    Line line10 = new Line();
		    line10.name("10天移动平均线");
		    Line line20 = new Line();
		    line20.name("20天移动平均线");
		    Line line60 = new Line();
		    line60.name("60天移动平均线");
		    Line line120 = new Line();
		    line120.name("120天移动平均线");
		    Line line250 = new Line();
		    line250.name("250天移动平均线");
		    for(StockHisVO vo:results){
		    	line5.data(vo.getDay5());
		    	line10.data(vo.getDay10());
		    	line20.data(vo.getDay20());
		    	line60.data(vo.getDay60());
		    	line120.data(vo.getDay120());
		    	line250.data(vo.getDay250());
		    }

		    option.series(k,line5,line10,line20,line60,line120,line250);
		    Option barPanl = new Option();
		    
		    barPanl.tooltip(tooltip);
		    barPanl.xAxis(xAxis);
		    barPanl.yAxis(yAxis);
		    Bar bar=new Bar();
		    bar.name("交易量");
		    Title title=new Title();
		    title.subtext("交易量");
		    barPanl.title(title);
		    for(StockHisVO vo:results){
		    	ArrayList<Double> data=new ArrayList<Double>();
		    	bar.data(vo.getVolume());
		    }
		    barPanl.series(bar);
		 
		    Option[] options=new  Option[2] ;
		    options[0]=option;
		    options[1]=barPanl;
	    return options;
	}

	public Map<String, Object> getPara() {
		return para;
	}

	public void setPara(Map<String, Object> para) {
		this.para = para;
	}
	
}
