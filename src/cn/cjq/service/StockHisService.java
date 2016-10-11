package cn.cjq.service;

import java.util.List;
import java.util.Map;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockHisVO;


public interface StockHisService {

	public List<StockHisVO> find(Map<String, Object> para);
	
	public int total(Map<String, Object> para);

	public List<StockHisMaxVO> findMaxDate(Map<String, Object> para);
	
	public Double findMaxOrMin(Map<String, Object> para);
}
