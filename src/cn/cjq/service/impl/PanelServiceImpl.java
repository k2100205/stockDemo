package cn.cjq.service.impl;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.bean.Panel;
import cn.cjq.mapper.PanelMapper;
import cn.cjq.mapper.ScheduleJobMapper;
import cn.cjq.service.PanelService;
import cn.cjq.service.ScheduleJobService;

@Service
@Transactional
public class PanelServiceImpl implements PanelService {
	@Resource
	private PanelMapper panelMapper;

	@Override
	public List<Panel> find(Panel panel) {
		Map<String, Object> para=new HashMap<String, Object>();
		para.put("TABLE", panel);
		return panelMapper.find(para);
	}



}
