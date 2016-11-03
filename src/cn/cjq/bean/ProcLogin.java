package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Types;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.OutParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_login")
public class ProcLogin implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@InParam(index = 1)
	  private String password;
	  @InParam(index = 2)
	  private String name;
	  @OutParam(index = 3, type = Types.VARCHAR)
	  private String msg;
	  @OutParam(index = 4, type = Types.VARCHAR)
	  private String msgStatus;
	  @OutParam(index = 5, type = Types.INTEGER)
	  private Integer companyId;
	  @OutParam(index = 6, type = Types.INTEGER)
	  private Integer peopleId;
	  @OutParam(index = 7, type = Types.VARCHAR)
	  private String dutyId;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getMsgStatus() {
		return msgStatus;
	}
	public void setMsgStatus(String msgStatus) {
		this.msgStatus = msgStatus;
	}
	public Integer getCompanyId() {
		return companyId;
	}
	public void setCompanyId(Integer companyId) {
		this.companyId = companyId;
	}
	public Integer getPeopleId() {
		return peopleId;
	}
	public void setPeopleId(Integer peopleId) {
		this.peopleId = peopleId;
	}
	public String getDutyId() {
		return dutyId;
	}
	public void setDutyId(String dutyId) {
		this.dutyId = dutyId;
	}

  
}
