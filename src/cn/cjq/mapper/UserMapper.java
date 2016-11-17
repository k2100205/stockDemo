package cn.cjq.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;

import cn.cjq.bean.StockVO;
import cn.cjq.bean.UserVO;
import cn.cjq.ibatis.tool.Provider;



public interface UserMapper {

	void save(UserVO user);
	boolean update(UserVO user);
	boolean delete(int id);
	UserVO findById(int id);
	List<UserVO> findAll();
	
	   @Options(useCache = true, flushCache = false, timeout = 10000)  
	   @SelectProvider(type =Provider.class, method = "select")
		public List<UserVO> find(Map<String, Object> para);
	   
	   @Options(useCache = true, flushCache = true, timeout = 10000)  
	   @InsertProvider(type =Provider.class, method = "insert")
		public int insert(Map<String, Object> para);
	   
	   @Options(useCache = true, flushCache = false, timeout = 10000)  
	   @SelectProvider(type =Provider.class, method = "total")
		public int toal(Map<String, Object> para);
	
	
}
