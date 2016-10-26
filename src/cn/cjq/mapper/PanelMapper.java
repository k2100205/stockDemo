package cn.cjq.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.SelectProvider;
import cn.cjq.bean.Panel;
import cn.cjq.ibatis.tool.Provider;

public interface PanelMapper {

   @Options(useCache = true, flushCache = false, timeout = 10000)  
   @SelectProvider(type =Provider.class, method = "select")
	public List<Panel> find(Map<String, Object> para);
   
}
