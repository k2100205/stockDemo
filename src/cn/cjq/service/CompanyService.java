package cn.cjq.service;


import java.util.List;
import java.util.Map;

import cn.cjq.bean.Company;



public interface CompanyService {

	
	/**
	 * 查找
	 * @param tree
	 * @return
	 */
	public List<Company> find(Map<String, Object> para);

	/**
	 * 总条数
	 * @param tree
	 * @return
	 */
	public int total(Map<String, Object> para);

}
