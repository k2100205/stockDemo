package cn.cjq.action;
import javax.servlet.http.HttpServletRequest;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class BIController{
	
	
	@RequestMapping(value = "/bi/info", method = RequestMethod.GET)
	public String index(HttpServletRequest request) throws SchedulerException {

		return "bi/wijspread";   
	}

	

}
