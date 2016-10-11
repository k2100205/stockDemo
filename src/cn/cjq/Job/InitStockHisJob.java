package cn.cjq.Job;

import java.lang.reflect.InvocationTargetException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.api.YahooStock;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.Stock;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockVO;
import cn.cjq.jdbc.BatchInsert;
import cn.cjq.mapper.StockMapper;
import cn.cjq.service.StockService;
import cn.cjq.service.impl.StockServiceImpl;

@Controller
public class InitStockHisJob implements Job {
	public static final String STOCK_NUM = "STOCK_NUM";
	public static final String STOCK_ID = "STOCK_ID";

	public void execute(JobExecutionContext context) throws JobExecutionException {
		// 获取 JobDataMap , 并从中取出参数
		JobDataMap data = context.getJobDetail().getJobDataMap();
		String stockNum = data.getString(STOCK_NUM);
		Long stockId = data.getLong(STOCK_ID);
		YahooStock yahooStock = new YahooStock();
		// 获取股票信息
		List<String> list = yahooStock.getStockInfo(stockNum,null,null);
		// 读取股票信息封装List
		List<StockHis> shlist = new ArrayList<StockHis>();
		if (list != null) {
			for (String s : list) {
//				String[] ss = s.split(",");
//				StockHis sh1 = new StockHis();
//				sh1.setStockId(stockId);
//				sh1.setDate(Timestamp.valueOf(ss[0] + " 00:00:00"));
//				sh1.setOpenPrice(Double.valueOf(ss[1]));
//				sh1.setHighPrice(Double.valueOf(ss[2]));
//				sh1.setLowPrice(Double.valueOf(ss[3]));
//				sh1.setClosePrice(Double.valueOf(ss[4]));
//				sh1.setVolume(Long.valueOf(ss[5]));
//				sh1.setAdjClose(Double.valueOf(ss[6]));
//				sh1.setCreateTime(new Timestamp(new java.util.Date().getTime()));
//				sh1.setCreatePeople("admin");
//				shlist.add(sh1);
				ProcStockHisIns ps=new ProcStockHisIns();
				String[] ss = s.split(",");
				StockHis sh1 = new StockHis();
				ps.setStockId(stockId);
				ps.setDate(Timestamp.valueOf(ss[0] + " 00:00:00"));
				ps.setOpenPrice(Double.valueOf(ss[1]));
				ps.setHighPrice(Double.valueOf(ss[2]));
				ps.setLowPrice(Double.valueOf(ss[3]));
				ps.setClosePrice(Double.valueOf(ss[4]));

				ps.setVolume(Long.valueOf(ss[5]));
				ps.setAdjClose(Double.valueOf(ss[6]));
				StockService stockService=new StockServiceImpl();
				stockService.insertProcHis(ps);

			}
//			// 批量插入 3000提交一次
//			int count = shlist.size() / 3000;
//			BatchInsert<StockHis> bt = new BatchInsert<StockHis>();
//			try{
//			for (int i = 0; i <count; i++) {
//					bt.batchInsert(shlist.subList(i*3000, 3000 * (i + 1)));
//			}
//				bt.batchInsert(shlist.subList(count*3000,shlist.size()));
//			} catch (Exception e) {
//				ProcStockSyncUpd proc =new ProcStockSyncUpd();
//				proc.setSyncStatus(e.toString());
//				proc.setSyncTime(new Timestamp(new Date().getTime()));
//				proc.setStockNum(stockNum);
//				StockService ss =new StockServiceImpl();
//				ss.updateProc(proc);
//				e.printStackTrace();
//			}
			ProcStockSyncUpd proc =new ProcStockSyncUpd();
			proc.setSyncStatus("同步成功");
			proc.setSyncTime(new Timestamp(new Date().getTime()));
			proc.setStockNum(stockNum);
			StockService ss =new StockServiceImpl();
			ss.updateProc(proc);
           
		}
		
		
	}
}// End Job