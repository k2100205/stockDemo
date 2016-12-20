/**
 * 
 */
package cn.cjq.interceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
/** 
* @author 作者 CJQ: 
* @version 创建时间：2016年10月31日 下午3:14:31 
* 类说明 
*/
/**
 * @author cjq
 *
 */
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.WebRequestInterceptor;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class AllInterceptor implements HandlerInterceptor   {
	
	/**
	 * 在请求处理之前执行，该方法主要是用于准备资源数据的，然后可以把它们当做请求属性放到WebRequest中
	 */
	

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#afterCompletion(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, java.lang.Exception)
	 */
	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#postHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3)
			throws Exception {
		// TODO Auto-generated method stub

		//重定向
		//arg1.sendRedirect(arg0.getContextPath());
//		if(arg0.getRequestURI()>0){
//			arg1.sendRedirect(arg0.getContextPath());  
//		}

		
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object)
	 */
	@Override
	public boolean preHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2) throws Exception {

		
		if(Control.DEV_MODE){
			return true;
		}
		//创建session
		HttpSession session =arg0.getSession();
		
		//无需登录，允许访问的地址
		String[] allowUrls =new String[]{"/demo"};
			
		//获取请求地址
		String url =arg0.getRequestURL().toString();
		
		//获得session中的用户
		Integer peopleId =(Integer) session.getAttribute("PEOPLE_ID");
		System.out.println(arg0.getRequestURI());
		if(!arg0.getRequestURI().equals("/demo/")){
			if (peopleId==null) {
				arg1.sendRedirect(arg0.getContextPath()); 
				return false;
			}  
	     }
		
		return true;
	}
	
}