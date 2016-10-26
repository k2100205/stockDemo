package cn.cjq.action;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
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
import org.springframework.web.servlet.ModelAndView;

import cn.cjq.Job.InitStockHisJob;

import cn.cjq.api.YahooStock;
import cn.cjq.bean.Panel;
import cn.cjq.bean.StockVO;
import cn.cjq.bean.TreeVO;
import cn.cjq.htmlparser.util.EasyHtmlParser;
import cn.cjq.htmlparser.util.HtmlParserTool;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.service.PanelService;
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
	@Autowired
	PanelService panelService;
	
	private List<StockVO> stocklist;
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView index(HttpServletRequest request) throws SchedulerException {

        Panel panel=new Panel();
       List<Panel> list= panelService.find(panel);
       Map<String,Object> map = new HashMap<String,Object>(); 
        map.put("list", list);
        System.out.println(list.get(0).getTitle());
		return new ModelAndView("demo/index",map);   
	}
	/**
	 * tree导航栏
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/tree/node")
	@ResponseBody
	public List<Map<String, Object>> getTreeNode(HttpServletRequest request,Long pid,String panelNum) 
	{
		List<Map<String, Object>> list=new  ArrayList<Map<String, Object>>();
		 List<HashMap<String,Object>> ts=null;
		if(pid!=null){
			TreeVO tree=new TreeVO();
			tree.setPid(pid);
	       ts=  treeservice.find(tree);
	
		}
		if(StringUtils.isNotBlank(panelNum)){
			TreeVO tree=new TreeVO();
			tree.setPanelNum(panelNum);
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
