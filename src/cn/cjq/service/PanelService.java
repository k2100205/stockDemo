package cn.cjq.service;


import java.util.List;

import cn.cjq.Job.util.ScheduleJob;
import cn.cjq.bean.Panel;



public interface PanelService {

	/**
	 * @查找所有定时器
	 */
	public List<Panel> find(Panel panel);


}
