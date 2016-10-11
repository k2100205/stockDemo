package cn.cjq.Job.util;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.jdbc.ConnectionDB;
import cn.cjq.service.ScheduleJobService;
@Service
@Transactional
public class QuartzManage {
	@Autowired
	ScheduleJobService service;
	@SuppressWarnings("unchecked")
	public void QuartzInit() {
		//schedulerFactoryBean 由spring创建注入
        @SuppressWarnings("resource")
		ApplicationContext ctx = new ClassPathXmlApplicationContext("spring-quartz.xml");  
        Scheduler scheduler = (Scheduler)ctx.getBean("schedulerFactoryBean");
        //这里获取任务信息数据
        List<ScheduleJob> jobList = new ArrayList<ScheduleJob>();
        ConnectionDB db=new ConnectionDB();
        ResultSet rs=db.executeQueryRS("select * from job_v",null);
		System.out.println("读取job:");
        try {
			while (rs.next()) {
				  ScheduleJob job=new ScheduleJob();
				  job.setJobId(rs.getLong("job_id"));
		          job.setJobName(rs.getString("job_name"));
		          job.setJobGroup(rs.getString("job_group"));
		          job.setJobStatus(rs.getString("job_status"));
		          job.setCronExpression(rs.getString("cron_expression"));
		          job.setDescription(rs.getString("description"));
		          job.setBeanClass(rs.getString("bean_class"));
		          jobList.add(job);
				}
		} catch (SQLException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
			return;
		}
       if(jobList.size()==0){
    	   return;
       }

        for (ScheduleJob job : jobList) {
			System.out.println("JobName:"+job.getJobName());

          TriggerKey triggerKey = TriggerKey.triggerKey(job.getJobName(), job.getJobGroup());
         
          //获取trigger，即在spring配置文件中定义的 bean id="myTrigger"
          CronTrigger trigger = null;
		try {
			trigger = (CronTrigger) scheduler.getTrigger(triggerKey);
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

          //不存在，创建一个
          if (null == trigger) {
            JobDetail jobDetail = null;
            try {
				jobDetail = JobBuilder.newJob((Class<? extends Job>) Class.forName(job.getBeanClass()))
				  .withIdentity(job.getJobName(), job.getJobGroup()).build();
			} catch (ClassNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
         
            //表达式调度构建器
            
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job
              .getCronExpression());
         
            //按新的cronExpression表达式构建一个新的trigger
            trigger = TriggerBuilder.newTrigger().withIdentity(job.getJobName(), job.getJobGroup()).withSchedule(scheduleBuilder).build();
            try {
				scheduler.scheduleJob(jobDetail, trigger);
			} catch (SchedulerException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
          } else {
            // Trigger已存在，那么更新相应的定时设置
            //表达式调度构建器
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job
              .getCronExpression());
         
            //按新的cronExpression表达式重新构建trigger
            trigger = trigger.getTriggerBuilder().withIdentity(triggerKey)
              .withSchedule(scheduleBuilder).build();
         
            //按新的trigger重新设置job执行
            try {
				scheduler.rescheduleJob(triggerKey, trigger);
			} catch (SchedulerException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
          }
        }

		
	}
}
