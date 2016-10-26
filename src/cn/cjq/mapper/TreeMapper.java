package cn.cjq.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import cn.cjq.bean.TreeVO;
import cn.cjq.ibatis.tool.Provider;

public interface TreeMapper {
	@Select("select  id,pid,text,url,icon_cls as iconCls ,node_status as `status`,checked  from tree")
	public List<HashMap<String,Object>> findAll();
	
	@SelectProvider(type =Provider.class, method = "select")
    public List<HashMap<String,Object>> find(Map<String, Object> para);
	
	
	@SelectProvider(type =Provider.class, method = "select")
    public List<TreeVO> findList(Map<String, Object> para);
	
	@SelectProvider(type =Provider.class, method = "total")
	public int toal(Map<String, Object> para);
}
