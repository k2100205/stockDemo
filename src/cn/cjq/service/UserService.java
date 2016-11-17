package cn.cjq.service;


import java.util.List;
import java.util.Map;

import cn.cjq.bean.UserVO;



public interface UserService {

	public UserVO findById(UserVO u);

	/**
	 * 查找
	 * @param tree
	 * @return
	 */
	public List<UserVO> find(Map<String, Object> para);

	/**
	 * 总条数
	 * @param tree
	 * @return
	 */
	public int total(Map<String, Object> para);

}
