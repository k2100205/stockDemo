package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "duty") 
public class Duty implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name="id")
	  private Long id;
	  @Column(name="company_id")
	  private Long companyId;
	  @Column(name="dept_id")
	  private String deptId;
	  @Column(name="dept_name")
	  private String deptName;
	  @Column(name="duty_id")
	  private String dutyId;
	  @Column(name="duty_name")
	  private String dutyName;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCompanyId() {
		return companyId;
	}
	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getDutyId() {
		return dutyId;
	}
	public void setDutyId(String dutyId) {
		this.dutyId = dutyId;
	}
	public String getDutyName() {
		return dutyName;
	}
	public void setDutyName(String dutyName) {
		this.dutyName = dutyName;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	 

}
