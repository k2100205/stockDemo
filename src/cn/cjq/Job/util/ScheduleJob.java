package cn.cjq.Job.util;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import cn.cjq.ibatis.tool.BeanMethod;
@Table(name = "job_v") 
@Entity
public class ScheduleJob implements BeanMethod{
		public static final String STATUS_RUNNING = "1";
		public static final String STATUS_NOT_RUNNING = "0";
		public static final String CONCURRENT_IS = "1";
		public static final String CONCURRENT_NOT = "0";
		
		public static final int JOB_ID = 1;

		
		@Column(name="job_Id")
		private Long jobId;
        
		private Timestamp createTime;

		private Timestamp updateTime;
		/**
		 * 任务名称
		 */
		@Column(name="job_name")
		private String jobName;	
		/**
		 * 任务分组
		 */
		@Column(name="job_group")
		private String jobGroup;
		/**
		 * 任务状态 是否启动任务
		 */
		private String jobStatus;
		/**
		 * cron表达式
		 */
		@Column(name="cron_expression")
		private String cronExpression;
		/**
		 * 描述
		 */
		private String description;
		/**
		 * 任务执行时调用哪个类的方法 包名+类名
		 */
		@Column(name="bean_class")
		private String beanClass;
		/**
		 * 任务是否有状态
		 */
		private String isConcurrent;
		/**
		 * spring bean
		 */
		private String springId;
		/**
		 * 任务调用的方法名
		 */
		private String methodName;
		public Long getJobId() {
			return jobId;
			
		}
		public void setJobId(Long jobId) {
			this.jobId = jobId;
		}

		public Timestamp getCreateTime() {
			return createTime;
		}
		public void setCreateTime(Timestamp createTime) {
			this.createTime = createTime;
		}
		public Timestamp getUpdateTime() {
			return updateTime;
		}
		public void setUpdateTime(Timestamp updateTime) {
			this.updateTime = updateTime;
		}
		public String getJobName() {
			return jobName;
		}
		public void setJobName(String jobName) {
			this.jobName = jobName;
		}
		public String getJobGroup() {
			return jobGroup;
		}
		public void setJobGroup(String jobGroup) {
			this.jobGroup = jobGroup;
		}
		public String getJobStatus() {
			return jobStatus;
		}
		public void setJobStatus(String jobStatus) {
			this.jobStatus = jobStatus;
		}
		public String getCronExpression() {
			return cronExpression;
		}
		public void setCronExpression(String cronExpression) {
			this.cronExpression = cronExpression;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public String getBeanClass() {
			return beanClass;
		}
		public void setBeanClass(String beanClass) {
			this.beanClass = beanClass;
		}
		public String getIsConcurrent() {
			return isConcurrent;
		}
		public void setIsConcurrent(String isConcurrent) {
			this.isConcurrent = isConcurrent;
		}
		public String getSpringId() {
			return springId;
		}
		public void setSpringId(String springId) {
			this.springId = springId;
		}
		public String getMethodName() {
			return methodName;
		}
		public void setMethodName(String methodName) {
			this.methodName = methodName;
		}

		@Override
		public List<String> setWhere() {
			List<String> wheres=new ArrayList<String>();
			if(jobId!=null){
				wheres.add("job_id ="+jobId);
			}
		return wheres;
		}

	
		
	
}
