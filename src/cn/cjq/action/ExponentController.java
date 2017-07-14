package cn.cjq.action;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.cjq.bean.DataMsg;
import cn.cjq.bean.ExponentDetail;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.htmlparser.util.HtmlSSESZ50;
import cn.cjq.htmlparser.util.HtmlStockCode;
import cn.cjq.htmlparser.util.LinkFilter;
import cn.cjq.jdbc.BatchInsert;
import net.sf.json.JSONObject;


@Controller
public class ExponentController{
	
	private DataMsg msg=new DataMsg();

		/**
		 * @param 跳转指数页面
		 * @return
		 */
		@RequestMapping(value = "exponent/index", method = RequestMethod.GET)
		public String exponentInfo(HttpServletRequest request) {
			return "exponent/exponent_info";   

		}
		

		/**
		 * @param session
		 * @param 同步上证501指数
		 * @return
		 * @throws Exception
		 */
		@RequestMapping(value = "exponent/sync_50")
		@ResponseBody
		public DataMsg exponent50Sync(HttpSession session,@ModelAttribute ProcStockUpd procStockUpd) throws Exception {
			String url = "http://query.sse.com.cn/index/consList.do?jsonCallBack=jQuery111204743864890384226_1476000082076&indexCode=000016&_=1476000082077";  
	        LinkFilter linkFilter = new LinkFilter(){  
	            @Override  
	           public boolean accept(String url) {  
//	                if(url.contains("baidu")){  
//	                    return true;  
//	               }else{  
//	                   return false;  
//	                }  
	            	 return true; 
	          }  
	              
	       };  
	       Set<String> urlSet = HtmlSSESZ50.extractLinks(url, linkFilter);  
	         
	       Iterator<String> it = urlSet.iterator();  
	       String str="";
	        while(it.hasNext()){  
	         str+=it.next();
	      
	        }
         
	        str=str.substring(str.indexOf("{"), str.length()-1);
	           JSONObject json=JSONObject.fromObject(str);
	           String jstr=(String) json.get("result").toString();
	           jstr=jstr.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\"","");
	           String[] num=jstr.split(",");
	           List<ExponentDetail>  list =new ArrayList<ExponentDetail>();
	           
	           for(int i=0;i<num.length;i=i+3){
	        	  ExponentDetail ed=new ExponentDetail();
	        	  ed.setExponentName("上证50");
	        	  ed.setExponentNum("000016");
	        	  ed.setStockName(num[i+1]);
	        	  ed.setStockNum(num[i]);
	        	  list.add(ed);
	           }
            BatchInsert<ExponentDetail> bi=new  BatchInsert<ExponentDetail>();
            bi.batchInsert(list);
			msg.setMsgStatus("S");
			msg.setMsgNum(1);
			msg.setMsgData("同步成功");
			return msg;
		}

		/**
		 * @param session
		 * @param 同步全部股票代码
		 * @return
		 * @throws Exception
		 */
		@RequestMapping(value = "exponent/sync_stockAll")
		@ResponseBody
		public DataMsg exponentAllSync(HttpSession session,@ModelAttribute ProcStockUpd procStockUpd) throws Exception {
			String url = "http://quote.eastmoney.com/stocklist.html";  
	        LinkFilter linkFilter = new LinkFilter(){  
	            @Override  
	           public boolean accept(String url) {  
//	                if(url.contains("baidu")){  
//	                    return true;  
//	               }else{  
//	                   return false;  
//	                }  
	            	 return true; 
	          }  
	              
	       };  
	       List<String> urlSet = HtmlStockCode.extractLinks(url, linkFilter);  
	         
	       Iterator<String> it = urlSet.iterator();  
	       String str="";
	       List<ExponentDetail>  list =new ArrayList<ExponentDetail>();
	        while(it.hasNext()){  
	         str=it.next();
       	  String stockNum=str.substring(str.indexOf("(")+1,str.indexOf(")"));
          String stockName=str.substring(0,str.indexOf("("));
          String check=stockNum.substring(0, 1);
     	 ExponentDetail ed=new ExponentDetail();
     	 System.out.println(check);
       	  if(check.equals("0")|check.equals("3")){
           	  ed.setExponentName("深证成指");
           	  ed.setExponentNum("399001");
           	  ed.setStockName(stockName);
           	  ed.setStockNum(stockNum);
           	 list.add(ed);
       	  }

       	  if(check.equals("6")){
             	
           	  ed.setExponentName("上证指数");
           	  ed.setExponentNum("0000001");
           	  ed.setStockName(stockName);
           	  ed.setStockNum(stockNum);
           	 list.add(ed);
       	  }
       	 
       	

	        }
         

            BatchInsert<ExponentDetail> bi=new  BatchInsert<ExponentDetail>();
            bi.batchInsert(list);
			msg.setMsgStatus("S");
			msg.setMsgNum(1);
			msg.setMsgData("同步成功");
			return msg;
		}
		public DataMsg getMsg() {
			return msg;
		}


		public void setMsg(DataMsg msg) {
			this.msg = msg;
		}
		
}
