package cn.cjq.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.SelectProvider;

import cn.cjq.bean.People;
import cn.cjq.ibatis.tool.Provider;

public interface PeopleMapper {

	

	@SelectProvider(type =Provider.class, method = "select")
    public List<People> find(Map<String, Object> para);
	
	@SelectProvider(type =Provider.class, method = "total")
	public int toal(Map<String, Object> para);
}
