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
import cn.cjq.service.CompanyService;

@Controller
public class CompanyController{
	

	@Autowired
	CompanyService companyService;
	Map<String, Object> para=new HashMap<String, Object>();

	/**
	 * 打开公司信息界面
	 * 
	 * @param request
	 * @return 
	 */
	@RequestMapping(value = "/company/page")
	public String companyPage(HttpServletRequest request) throws SchedulerException {
		return "company/company_page";   
	}
	/**
	 * 获取所有人员信息
	 * 
	 * @param request
	 * @return json数据
	 */
	@RequestMapping(value = "/company/info")
	@ResponseBody
	public DataGrid<Company>  getAllcompany(HttpServletRequest request,  Integer page,
	         Integer rows) {
	    DataGrid<Company> dg = new DataGrid<Company>();  
	    Company s=new Company();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<Company> results= companyService.find(para); 
	    dg.setTotal(companyService.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;

	}
	
	
}
