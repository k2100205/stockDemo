package cn.cjq.service;


import java.util.List;
import java.util.Map;

import cn.cjq.bean.Duty;



public interface DutyService {

	
	/**
	 * 查找
	 * @param tree
	 * @return
	 */
	public List<Duty> find(Map<String, Object> para);

	/**
	 * 总条数
	 * @param tree
	 * @return
	 */
	public int total(Map<String, Object> para);

}
