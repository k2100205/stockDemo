package cn.cjq.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Select;

import cn.cjq.bean.People;
import cn.cjq.bean.TreeVO;



public interface PeopleService {

	
	/**
	 * 查找
	 * @param tree
	 * @return
	 */
	public List<People> find(Map<String, Object> para);

	/**
	 * 总条数
	 * @param tree
	 * @return
	 */
	public int total(Map<String, Object> para);

}
