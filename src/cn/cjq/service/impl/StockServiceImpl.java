package cn.cjq.service.impl;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.bean.ProcStock;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.StockVO;
import cn.cjq.mapper.StockMapper;
import cn.cjq.procedure.ProcSupport;
import cn.cjq.service.StockService;

@Service
@Transactional
public class StockServiceImpl implements StockService {
	@Resource
	private StockMapper sm;

	@Override
	public List<StockVO> find(Map<String, Object> para) {
		return sm.find(para);
	}
	
	

	@Override
	public ProcStock insertProc( ProcStock proc) {
		ProcSupport.callProc(proc);
		return proc;
	}
	@Override
	public ProcStockHisIns insertProcHis( ProcStockHisIns proc) {
		ProcSupport.callProc(proc);
		return proc;
	}

	@Override
	public ProcStockDel updateProc(ProcStockDel proc) {
		ProcSupport.callProc(proc);
		return proc;
	}

	@Override
	public ProcStockDel deleteStockProc(ProcStockDel proc) {
		ProcSupport.callProc(proc);
		return proc;
	}

	@Override
	public ProcStockSyncUpd updateProc(ProcStockSyncUpd proc) {
		ProcSupport.callProc(proc);
		return proc;
	}

	@Override
	public ProcStockUpd updateProc(ProcStockUpd proc) {
		ProcSupport.callProc(proc);
		return proc;
	}



	@Override
	public int total(Map<String, Object> para) {
		return  sm.toal(para);
	}
}
