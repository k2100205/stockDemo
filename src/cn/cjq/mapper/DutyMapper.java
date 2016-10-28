package cn.cjq.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.SelectProvider;
import cn.cjq.bean.Company;
import cn.cjq.bean.Duty;
import cn.cjq.ibatis.tool.Provider;

public interface DutyMapper {


	@SelectProvider(type =Provider.class, method = "select")
    public List<Duty> find(Map<String, Object> para);
	
	@SelectProvider(type =Provider.class, method = "total")
	public int toal(Map<String, Object> para);
}
