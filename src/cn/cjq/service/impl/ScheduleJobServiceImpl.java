package cn.cjq.service.impl;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.mapper.ScheduleJobMapper;
import cn.cjq.service.ScheduleJobService;

@Service
@Transactional
public class ScheduleJobServiceImpl implements ScheduleJobService {
	@Resource
	private ScheduleJobMapper jobMapper;

	@Override
	public List<ScheduleJob> find() {
		// TODO Auto-generated method stub
		Map<String, Object> para=new HashMap<String, Object>();
		ScheduleJob sj=new ScheduleJob();
		sj.setJobId(1L);
		para.put("TABLE", sj);
		return jobMapper.find(para);
	}

}
