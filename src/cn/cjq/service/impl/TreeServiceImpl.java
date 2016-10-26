package cn.cjq.service.impl;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.bean.TreeVO;
import cn.cjq.mapper.ScheduleJobMapper;
import cn.cjq.mapper.TreeMapper;
import cn.cjq.service.ScheduleJobService;
import cn.cjq.service.TreeService;

@Service
@Transactional
public class TreeServiceImpl implements TreeService {
	@Resource
	private TreeMapper treeMapper;

	@Override
	public List<HashMap<String,Object>> findAll() {
		
		Map<String, Object> para=new HashMap<String, Object>();
		TreeVO tree=new TreeVO();
		para.put("TABLE", tree);
		return treeMapper.find(para);
	}
	
	@Override
	public List<HashMap<String,Object>> find(TreeVO tree) {
		
		Map<String, Object> para=new HashMap<String, Object>();
		para.put("TABLE", tree);
		return treeMapper.find(para);
	}

	/* (non-Javadoc)
	 * @see cn.cjq.service.TreeService#findList(cn.cjq.bean.TreeVO)
	 */
	@Override
	public List<TreeVO> find(Map<String, Object> para) {
		// TODO Auto-generated method stub
		return treeMapper.findList(para);
	}
	
	@Override
	public int total(Map<String, Object> para) {
		return  treeMapper.toal(para);
	}
}
