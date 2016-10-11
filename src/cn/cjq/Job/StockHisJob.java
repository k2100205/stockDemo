package cn.cjq.Job;

import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.SQLException;
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

import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.api.YahooStock;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.Stock;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockVO;
import cn.cjq.jdbc.BatchInsert;
import cn.cjq.jdbc.ConnectionDB;
import cn.cjq.mapper.StockMapper;
import cn.cjq.service.StockService;
import cn.cjq.service.impl.StockServiceImpl;

@Controller
public class StockHisJob implements Job {

	public void execute(JobExecutionContext context) throws JobExecutionException {


		  ConnectionDB db=new ConnectionDB();
	        ResultSet rs=db.executeQueryRS("select * from stock_his_maxdate_v",null);
	        List<StockHisMaxVO> jobList=new ArrayList<StockHisMaxVO>();
	        try {
				while (rs.next()) {
					  StockHisMaxVO job=new StockHisMaxVO();
					  job.setStockId(rs.getLong("stock_id"));
			          job.setStockNum(rs.getString("stock_num"));
			          job.setDate(rs.getTimestamp("date"));
			          jobList.add(job);
					}
			} catch (SQLException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
				return;
			}
		if(jobList.size()>0){
			for(StockHisMaxVO vo: jobList){
				YahooStock yahooStock = new YahooStock();
				List<String> list = yahooStock.getStockInfo(vo.getStockNum(),vo.getDate(),null);
				if (list != null) {
					StockService service=new StockServiceImpl();

					for (String s : list) {
						ProcStockHisIns ps=new ProcStockHisIns();
						String[] ss = s.split(",");
						ps.setStockId(vo.getStockId());
						ps.setDate(Timestamp.valueOf(ss[0] + " 00:00:00"));
						ps.setOpenPrice(Double.valueOf(ss[1]));
						ps.setHighPrice(Double.valueOf(ss[2]));
						ps.setLowPrice(Double.valueOf(ss[3]));
						ps.setClosePrice(Double.valueOf(ss[4]));
						ps.setVolume(Long.valueOf(ss[5]));
						ps.setAdjClose(Double.valueOf(ss[6]));
						service.insertProcHis(ps);
					}
					ProcStockSyncUpd proc =new ProcStockSyncUpd();
					proc.setSyncStatus("同步成功");
					proc.setSyncTime(new Timestamp(new Date().getTime()));
					proc.setStockNum(vo.getStockNum());

					service.updateProc(proc);
			}

		}
		
           
		}
		
		
	}
}// End Job