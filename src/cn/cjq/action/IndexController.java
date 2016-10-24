package cn.cjq.action;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.jasper.tagplugins.jstl.core.Out;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.cjq.Job.InitStockHisJob;

import cn.cjq.api.YahooStock;
import cn.cjq.bean.StockVO;
import cn.cjq.bean.TreeVO;
import cn.cjq.htmlparser.util.EasyHtmlParser;
import cn.cjq.htmlparser.util.HtmlParserTool;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.service.ScheduleJobService;
import cn.cjq.service.StockService;
import cn.cjq.service.TreeService;
import cn.cjq.util.JsonUtil;
import net.sf.json.JSONObject;

@Controller
public class IndexController{
	

	@Autowired
	TreeService treeservice;
	@Autowired
	ScheduleJobService scheduleJobService;
	@Autowired
	StockService stockService;
	@Autowired
	YahooStock yahooStock;
	
	private List<StockVO> stocklist;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public String index(HttpServletRequest request) throws SchedulerException {


		           // jstr=jstr.replaceAll("[", "").replaceAll("]", "");
//		           String jstr="str.substring(str.indexOf("{"), str.length()-1){"+str.substring(str.indexOf("pageHelp")-1, str.length()-1);
//		          / System.out.println(jstr);
//
//		           JSONObject json=JSONObject.fromObject(jstr);
//		           System.out.println(json.toString());
                  // String ss[]=json.get  
		           
		           
		       

		return "demo/index";   
	}
	/**
	 * tree导航栏
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/tree/node")
	@ResponseBody
	public List<Map<String, Object>> getTreeNode(HttpServletRequest request,Long pid) 
	{
		List<Map<String, Object>> list=new  ArrayList<Map<String, Object>>();
		 List<HashMap<String,Object>> ts=null;
		if(pid==null){
      ts=  treeservice.findAll();
		}else{
			TreeVO tree=new TreeVO();
			tree.setPid(pid);
	       ts=  treeservice.find(tree);
	
		}
        list.addAll(ts);
        return list;
	}
	public List<StockVO> getStocklist() {
		return stocklist;
	}
	public void setStocklist(List<StockVO> stocklist) {
		this.stocklist = stocklist;
	}

}
