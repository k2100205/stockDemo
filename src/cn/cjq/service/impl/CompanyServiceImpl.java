package cn.cjq.service.impl;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.bean.Company;
import cn.cjq.bean.People;
import cn.cjq.mapper.CompanyMapper;
import cn.cjq.mapper.PeopleMapper;
import cn.cjq.service.CompanyService;
import cn.cjq.service.PeopleService;

@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {
	@Resource
	private CompanyMapper mapper;


	@Override
	public List<Company> find(Map<String, Object> para) {
		// TODO Auto-generated method stub
		return mapper.find(para);
	}
	
	@Override
	public int total(Map<String, Object> para) {
		return  mapper.toal(para);
	}
}
