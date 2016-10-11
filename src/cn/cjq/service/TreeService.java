package cn.cjq.service;


import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Select;

import cn.cjq.bean.TreeVO;



public interface TreeService {
	public List<HashMap<String,Object>> findAll();


}
