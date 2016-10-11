package cn.cjq.service;


import java.util.List;
import java.util.Map;

import cn.cjq.bean.ProcStock;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.StockVO;



public interface StockService {

	public List<StockVO> find(Map<String, Object> para);
	
	public int total(Map<String, Object> para);

	public ProcStock insertProc(ProcStock proc);
	
	public ProcStockHisIns insertProcHis(ProcStockHisIns proc);
	
	public ProcStockDel deleteStockProc(ProcStockDel proc);
	
	public ProcStockSyncUpd updateProc(ProcStockSyncUpd proc);
	
	public ProcStockUpd updateProc(ProcStockUpd proc);
	
	public ProcStockDel updateProc(ProcStockDel proc);

}
