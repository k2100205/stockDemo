package cn.cjq.action;

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
import cn.cjq.bean.DataGrid;
import cn.cjq.bean.Panel;
import cn.cjq.bean.People;
import cn.cjq.bean.StockVO;
import cn.cjq.bean.TreeVO;
import cn.cjq.htmlparser.util.EasyHtmlParser;
import cn.cjq.htmlparser.util.HtmlParserTool;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.service.PanelService;
import cn.cjq.service.PeopleService;
import cn.cjq.service.ScheduleJobService;
import cn.cjq.service.StockService;
import cn.cjq.service.TreeService;
import cn.cjq.util.JsonUtil;
import net.sf.json.JSONObject;

@Controller
public class PeopleController{
	

	@Autowired
	PeopleService peopleService;
	Map<String, Object> para=new HashMap<String, Object>();

	/**
	 * 打开人员信息界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/people/page")
	public String treePage(HttpServletRequest request) throws SchedulerException {
		return "people/people_page";   
	}
	/**
	 * 获取所有人员信息
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/people/info")
	@ResponseBody
	public DataGrid<People>  getAllPeople(HttpServletRequest request,  Integer page,
	         Integer rows) {
	    DataGrid<People> dg = new DataGrid<People>();  
	    People s=new People();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<People> results= peopleService.find(para); 
	    dg.setTotal(peopleService.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;

	}
	
	
}
