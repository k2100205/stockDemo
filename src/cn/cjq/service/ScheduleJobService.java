package cn.cjq.service;


import java.util.List;

import cn.cjq.Job.util.ScheduleJob;



public interface ScheduleJobService {

	/**
	 * @查找所有定时器
	 */
	public List<ScheduleJob> find();


}
