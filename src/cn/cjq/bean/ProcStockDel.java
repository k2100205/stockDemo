package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Types;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.OutParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_stock_info_del")
public class ProcStockDel implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	

	  @InParam(index = 1)
	  private String stockNum;
	  @OutParam(index = 2, type = Types.VARCHAR)
	  private String msg;
	  @OutParam(index = 3, type = Types.VARCHAR)
	  private String msgStatus;
	
	public String getStockNum() {
		return stockNum;
	}
	public void setStockNum(String stockNum) {
		this.stockNum = stockNum;
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


}
