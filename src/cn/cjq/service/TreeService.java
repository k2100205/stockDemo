package cn.cjq.service;


import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Select;

import cn.cjq.bean.TreeVO;



public interface TreeService {
	public List<HashMap<String,Object>> findAll();

	/**
	 * 查找子节点
	 * @param tree
	 * @return
	 */
	public List<HashMap<String, Object>> find(TreeVO tree);


}
