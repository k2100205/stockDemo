package cn.cjq.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.bean.UserVO;
import cn.cjq.mapper.UserMapper;
import cn.cjq.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {
	@Resource
	private UserMapper userMapper;
	@Override
	public UserVO findById(UserVO u) {
		// TODO Auto-generated method stub
		return userMapper.findById(1);
	}

}
