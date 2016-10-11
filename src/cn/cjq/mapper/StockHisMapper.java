package cn.cjq.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;
import cn.cjq.bean.StockHis;
import cn.cjq.bean.StockHisMaxVO;
import cn.cjq.bean.StockHisVO;
import cn.cjq.ibatis.tool.Provider;

public interface StockHisMapper {

   @SelectProvider(type =Provider.class, method = "select")
	public List<StockHisVO> find(Map<String, Object> para);
   
   @SelectProvider(type =Provider.class, method = "total")
	public int toal(Map<String, Object> para);
   
   @SelectProvider(type =Provider.class, method = "select")
	public List<StockHisMaxVO> findMaxDate(Map<String, Object> para);
   
   @SelectProvider(type =Provider.class, method = "maxOrMin")
	public Double findmaxOrMin(Map<String, Object> para);
}
