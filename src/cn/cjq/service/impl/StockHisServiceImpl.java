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
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockHisVO;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.StockVO;
import cn.cjq.mapper.StockHisMapper;
import cn.cjq.mapper.StockMapper;
import cn.cjq.procedure.ProcSupport;
import cn.cjq.service.StockHisService;
import cn.cjq.service.StockService;

@Service
@Transactional
public class StockHisServiceImpl implements StockHisService {
	@Resource
	private StockHisMapper sm;

	@Override
	public List<StockHisVO> find(Map<String, Object> para) {
		return sm.find(para);
	}
	
	@Override
	public int total(Map<String, Object> para) {
		return  sm.toal(para);
	}

	@Override
	public List<StockHisMaxVO> findMaxDate(Map<String, Object> para) {
		return sm.findMaxDate(para);
	}

	@Override
	public Double findMaxOrMin(Map<String, Object> para) {
		return sm.findmaxOrMin(para);
	}
}
