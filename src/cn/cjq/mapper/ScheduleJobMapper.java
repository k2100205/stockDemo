package cn.cjq.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.type.JdbcType;

import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.ibatis.tool.Provider;

public interface ScheduleJobMapper {

   @Options(useCache = true, flushCache = false, timeout = 10000)  
   @SelectProvider(type =Provider.class, method = "select")
	public List<ScheduleJob> find(Map<String, Object> para);
}
