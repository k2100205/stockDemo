package cn.cjq.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.cjq.bean.Company;
import cn.cjq.bean.DataGrid;
import cn.cjq.bean.Duty;
import cn.cjq.bean.People;
import cn.cjq.service.CompanyService;
import cn.cjq.service.DutyService;
import cn.cjq.service.PeopleService;

@Controller
public class DutyController{
	

	@Autowired
	DutyService dutyService;
	Map<String, Object> para=new HashMap<String, Object>();

	/**
	 * 打开职责信息界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/duty/page")
	public String companyPage(HttpServletRequest request) throws SchedulerException {
		return "company/duty_page";   
	}
	/**
	 * 获取所有职责信息
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/duty/info")
	@ResponseBody
	public DataGrid<Duty>  getAllcompany(HttpServletRequest request,  Integer page,
	         Integer rows) {
	    DataGrid<Duty> dg = new DataGrid<Duty>();  
	    Duty s=new Duty();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<Duty> results= dutyService.find(para); 
	    dg.setTotal(dutyService.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;

	}
	
	
}
