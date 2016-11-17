package cn.cjq.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.jasper.tagplugins.jstl.core.Out;
import org.apache.tomcat.jni.User;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.cjq.Job.InitStockHisJob;

import cn.cjq.api.YahooStock;
import cn.cjq.bean.DataGrid;
import cn.cjq.bean.DataMsg;
import cn.cjq.bean.Panel;
import cn.cjq.bean.ProcLogin;
import cn.cjq.bean.ProcStock;
import cn.cjq.bean.StockVO;
import cn.cjq.bean.TreeVO;
import cn.cjq.bean.UserVO;
import cn.cjq.htmlparser.util.EasyHtmlParser;
import cn.cjq.htmlparser.util.HtmlParserTool;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.service.LoginService;
import cn.cjq.service.PanelService;
import cn.cjq.service.ScheduleJobService;
import cn.cjq.service.StockService;
import cn.cjq.service.TreeService;
import cn.cjq.service.UserService;
import cn.cjq.util.JsonUtil;
import cn.cjq.util.MD5Tools;
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
	@Autowired
	LoginService loginService;
	
	@Autowired
	UserService userService;
	
	private List<StockVO> stocklist;
	Map<String, Object> para=new HashMap<String, Object>();
	private DataMsg msg=new DataMsg();
	
	/**
	 * 检测缓存是否存在
	 * 
	 * @param request
	 * @return 
	 */
	@SuppressWarnings("null")
	@RequestMapping(value = "demo/checkLogin")
	@ResponseBody
	public DataMsg checkLogin(HttpSession session) throws Exception {
		
		if(session.getAttribute("PEOPLE_ID")!=null){
			msg.setMsgStatus("S");
			msg.setMsgNum(1);
			msg.setMsgData("无需重新登陆");
			
		}else{
			msg.setMsgStatus("E");
			msg.setMsgNum(1);
			msg.setMsgData("请重新登陆");
			
		}
		
		return msg;
	}
	
	

	@RequestMapping(value = "", method = RequestMethod.GET)
	public ModelAndView index(HttpServletRequest request) throws SchedulerException {
        Panel panel=new Panel();
       List<Panel> list= panelService.find(panel);
       Map<String,Object> map = new HashMap<String,Object>(); 
        map.put("list", list);
		return new ModelAndView("demo/index",map);   
	}
	
	/**
	 * 打开导航栏维护界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "demo/login")
	@ResponseBody
	public DataMsg login(HttpSession session,String name,String password) throws Exception {
		if(name!=null&&password!=null){
			System.out.println(MD5Tools.MD5(password));
			ProcLogin pl=new ProcLogin();
			pl.setName(name);
			pl.setPassword(MD5Tools.MD5(password));
			loginService.login(pl);
			msg.setMsgStatus(pl.getMsgStatus());
			msg.setMsgNum(1);
			msg.setMsgData(pl.getMsg());
			if(pl.getMsgStatus().equals("S")){
				session.setAttribute("DUTY_ID", pl.getDutyId()); 
				session.setAttribute("COMPANY_ID", pl.getCompanyId()); 
				session.setAttribute("PEOPLE_ID", pl.getPeopleId()); 

			}
			
			
        }  
		return msg;
	}
	/**
	 * 打开导航栏维护界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/panel/page")
	public ModelAndView panelPage(HttpServletRequest request) throws SchedulerException {
        Panel panel=new Panel();
       List<Panel> list= panelService.find(panel);
       Map<String,Object> map = new HashMap<String,Object>(); 
        map.put("list", list);
		return new ModelAndView("demo/panel_page",map);   
	}
	
	/**
	 * 打开菜单维护界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/tree/page")
	public String treePage(HttpServletRequest request) throws SchedulerException {
		return "demo/tree_page";   
	}
	
	/**
	 * 打开菜单维护界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/user/page")
	public String userPage(HttpServletRequest request) throws SchedulerException {
		return "demo/user_page";   
	}
	
	/**
	 * 获取所有账户
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/user/info")
	@ResponseBody
	public DataGrid<UserVO>  getUser(HttpServletRequest request,  Integer page,
	         Integer rows) {
	    DataGrid<UserVO> dg = new DataGrid<UserVO>();  
	    UserVO s=new UserVO();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<UserVO> results= userService.find(para); 
	    dg.setTotal(userService.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;

	}
	
	/**
	 * 获取所有tree
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/tree/all")
	@ResponseBody
	public DataGrid<TreeVO>  getAllTree(HttpServletRequest request,  Integer page,
	         Integer rows) {
	    DataGrid<TreeVO> dg = new DataGrid<TreeVO>();  
	    TreeVO s=new TreeVO();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<TreeVO> results= treeservice.find(para); 
	    dg.setTotal(treeservice.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;

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
