package cn.cjq.action;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

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
import cn.cjq.htmlparser.util.EasyHtmlParser;
import cn.cjq.htmlparser.util.HtmlParserTool;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.service.ScheduleJobService;
import cn.cjq.service.StockService;
import cn.cjq.service.TreeService;

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

		String url = "http://query.sse.com.cn/index/consList.do?jsonCallBack=jQuery111204743864890384226_1476000082076&indexCode=000016&_=1476000082077";  
		        LinkFilter linkFilter = new LinkFilter(){  
		            @Override  
		           public boolean accept(String url) {  
//		                if(url.contains("baidu")){  
//		                    return true;  
//		               }else{  
//		                   return false;  
//		                }  
		            	 return true; 
		          }  
		              
		       };  
		       Set<String> urlSet = HtmlSSESZ50.extractLinks(url, linkFilter);  
		         
		       Iterator<String> it = urlSet.iterator();  
		        while(it.hasNext()){  
		           System.out.println(it.next());  
		       }  

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
	public List<Map<String, Object>> getTreeNode(HttpServletRequest request) 
	{
		List<Map<String, Object>> list=new  ArrayList<Map<String, Object>>();
        List<HashMap<String,Object>> ts=  treeservice.findAll();
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
