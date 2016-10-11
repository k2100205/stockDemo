package cn.cjq.mapper;

import java.util.List;

import cn.cjq.bean.UserVO;



public interface UserMapper {

	void save(UserVO user);
	boolean update(UserVO user);
	boolean delete(int id);
	UserVO findById(int id);
	List<UserVO> findAll();
}
