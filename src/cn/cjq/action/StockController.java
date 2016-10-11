package cn.cjq.action;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.cjq.Job.InitStockHisJob;
import cn.cjq.api.YahooStock;
import cn.cjq.bean.DataGrid;
import cn.cjq.bean.DataMsg;
import cn.cjq.bean.ProcStock;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockHisVO;
import cn.cjq.bean.StockVO;

import cn.cjq.service.StockHisService;
import cn.cjq.service.StockService;
import cn.cjq.service.impl.StockServiceImpl;

@Controller
public class StockController{
	
	@Autowired
	StockService stockService;
	@Autowired
	StockHisService stockHisService;
	@Autowired
	YahooStock yahooStock;
	
	private List<StockVO> stocklist;
	Map<String, Object> para=new HashMap<String, Object>();
	private DataMsg msg=new DataMsg();
	  @InitBinder("procStock")    
	 public void initBinder1(WebDataBinder binder) {    
	             binder.setFieldDefaultPrefix("procStock.");    
	     }   
	  @InitBinder("procStockUpd")    
	 public void initBinder2(WebDataBinder binder) {    
	             binder.setFieldDefaultPrefix("procStockUpd.");    
	     }  

		@RequestMapping(value = "stock/stockHis")
		@ResponseBody
		public DataGrid<StockHisVO> queryStockHis(HttpSession session,  Integer page,Integer rows,StockHisVO sh) {
		    DataGrid<StockHisVO> dg = new DataGrid<StockHisVO>();  
			para.put("TABLE", sh);
			para.put("PAGE", page);
			para.put("ORDER_BY", "date desc,stockNum asc");
			para.put("PAGE_SIZE", rows);
		    List<StockHisVO> results= stockHisService.find(para); 
		    dg.setTotal(stockHisService.total(para));  //总的数据条数,从数据库中查询出来的
		    dg.setRows(results);
		    return dg;
		}
	  
//	 跳转股票信息页面
	@RequestMapping(value = "stock_his/info", method = RequestMethod.GET)
	public ModelAndView indexStockHis(HttpServletRequest request) {
		return new ModelAndView("stock/stock_his",null);   
	}
//	 跳转股票历史
	@RequestMapping(value = "stock/info", method = RequestMethod.GET)
	public ModelAndView index(HttpServletRequest request) {
		return new ModelAndView("stock/stock_info",null);   
	}
	
	
	@RequestMapping(value = "stock/stockVO")
	@ResponseBody
	public DataGrid<StockVO> queryStockVO(HttpSession session,  Integer page,
	         Integer rows) {
	    DataGrid<StockVO> dg = new DataGrid<StockVO>();  
	    StockVO s=new StockVO();
		para.put("TABLE", s);
		para.put("PAGE", page);
		para.put("PAGE_SIZE", rows);
	    List<StockVO> results= stockService.find(para); 
	    dg.setTotal(stockService.total(para));  //总的数据条数,从数据库中查询出来的
	    dg.setRows(results);
	    return dg;
	}
	//同步股票信息
	@RequestMapping(value = "stock/syncStock")
	@ResponseBody
	public DataMsg syncStock(HttpSession session,@RequestParam("data[]")  List<String> data)  {
		try{
		//解析字符串
		List<StockVO> stocklist=new ArrayList<StockVO>();
		for(int i=0;i<data.size();i=i+2){
			StockVO vo=new StockVO();
			vo.setStockId(Long.parseLong(data.get(i)));
			vo.setStockNum(data.get(i+1));
			stocklist.add(vo);
		}
		//同步股票数据
		for(StockVO sk:stocklist){
			para.clear();
			StockHisMaxVO vo =new StockHisMaxVO();
			vo.setStockId(sk.getStockId());
			para.put("TABLE", vo);
			List<StockHisMaxVO> shmv=stockHisService.findMaxDate(para);
			List<String> list = yahooStock.getStockInfo(sk.getStockNum(),shmv.get(0).getDate(),null);
			if (list.size()>0) {
				for (String s : list) {
					ProcStockHisIns ps=new ProcStockHisIns();
					String[] ss = s.split(",");
					StockHis sh1 = new StockHis();
					ps.setStockId(sk.getStockId());
					ps.setDate(Timestamp.valueOf(ss[0] + " 00:00:00"));
					ps.setOpenPrice(Double.valueOf(ss[1]));
					ps.setHighPrice(Double.valueOf(ss[2]));
					ps.setLowPrice(Double.valueOf(ss[3]));
					ps.setClosePrice(Double.valueOf(ss[4]));

					ps.setVolume(Long.valueOf(ss[5]));
					ps.setAdjClose(Double.valueOf(ss[6]));
					stockService.insertProcHis(ps);
					

				}
				ProcStockSyncUpd proc =new ProcStockSyncUpd();
				proc.setSyncStatus("同步成功");
				proc.setSyncTime(new Timestamp(new Date().getTime()));
				proc.setStockNum(sk.getStockNum());

				stockService.updateProc(proc);
				msg.setMsgStatus(proc.getMsgStatus());
				msg.setMsgNum(1);
				msg.setMsgData(proc.getMsg());
			}
			

	   }
		}catch(Exception e){
			msg.setMsgData(e.toString());
		}
	
		return msg;
	}
	
	
	//初始化股票信息
	@RequestMapping(value = "stock/sync")
	@ResponseBody
	public DataMsg syncStockHis(HttpSession session,@RequestParam("data[]")  List<String> data)  {
		try{
		//解析字符串
		List<StockVO> stocklist=new ArrayList<StockVO>();
		for(int i=0;i<data.size();i=i+2){
			StockVO vo=new StockVO();
			vo.setStockId(Long.parseLong(data.get(i)));
			vo.setStockNum(data.get(i+1));
			stocklist.add(vo);
		}
		//同步股票数据
		for(StockVO sk:stocklist){
	    SchedulerFactory sf = new StdSchedulerFactory();
	    Scheduler scheduler = sf.getScheduler(); 
        JobDetail job = JobBuilder.newJob(InitStockHisJob.class).withIdentity(sk.getStockNum(), "stockHis").build();
        job.getJobDataMap().put(InitStockHisJob.STOCK_NUM, sk.getStockNum());
        job.getJobDataMap().put(InitStockHisJob.STOCK_ID, sk.getStockId());
        Trigger trigger = TriggerBuilder.newTrigger().withIdentity(sk.getStockNum()+"trigger", "stockHis")
                .startNow().build();
        scheduler.scheduleJob(job, trigger);
        scheduler.start();
	   }
		msg.setMsgStatus("SUCCESS");
		msg.setMsgNum(1);
		msg.setMsgData("提交成功 稍等片刻刷新页面");
		}catch(Exception e){
			msg.setMsgData(e.toString());
		}
	
		return msg;
	}
 // 插入股票信息
	@RequestMapping(value = "stock/stockIns")
	@ResponseBody
	public DataMsg stockIns(HttpSession session,@ModelAttribute ProcStock procStock) throws Exception {
		if(procStock!=null){
			stockService.insertProc(procStock);
			msg.setMsgStatus(procStock.getMsgStatus());
			msg.setMsgNum(1);
			msg.setMsgData(procStock.getMsg());
        }  
		return msg;
	}
	 // 删除股票信息
	@RequestMapping(value = "stock/stockDel")
	@ResponseBody
	public DataMsg stockDel(HttpSession session,@RequestParam("data[]")  List<String> data) throws Exception {
		try{
			//解析字符串
			List<ProcStockDel> stocklist=new ArrayList<ProcStockDel>();
			for(int i=0;i<data.size();i++){
				ProcStockDel proc=new ProcStockDel();
				proc.setStockNum(data.get(i));
				stocklist.add(proc);
			}
			//删除
			for(ProcStockDel sk:stocklist){
				stockService.deleteStockProc(sk);
				msg.setMsgStatus(sk.getMsgStatus());
				msg.setMsgNum(1);
				msg.setMsgData(sk.getMsg());
		   }
			msg.setMsgStatus("SUCCESS");
			msg.setMsgNum(1);
			msg.setMsgData("删除成功");
			}catch(Exception e){
				msg.setMsgData(e.toString());
			}
		
			return msg;
	}
	 //更新股票信息
	@RequestMapping(value = "stock/stockUpd")
	@ResponseBody
	public DataMsg stockUpd(HttpSession session,@ModelAttribute ProcStockUpd procStockUpd) throws Exception {
		if(procStockUpd!=null){
			stockService.updateProc(procStockUpd);
			msg.setMsgStatus(procStockUpd.getMsgStatus());
			msg.setMsgNum(1);
			msg.setMsgData(procStockUpd.getMsg());
        }  
		return msg;
	}
	
	public DataMsg getMsg() {
		return msg;
	}
	public void setMsg(DataMsg msg) {
		this.msg = msg;
	}
	public Map<String, Object> getPara() {
		return para;
	}
	public void setPara(Map<String, Object> para) {
		this.para = para;
	}

	
}
