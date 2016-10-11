package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Types;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.OutParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_stock_info_upd")
public class ProcStockUpd implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	  @InParam(index = 1)
	  private String stockNum;
	  @InParam(index = 2)
	  private String stockName;
	  @OutParam(index = 3, type = Types.VARCHAR)
	  private String msg;
	  @OutParam(index = 4, type = Types.VARCHAR)
	  private String msgStatus;

	public String getStockNum() {
		return stockNum;
	}
	public void setStockNum(String stockNum) {
		this.stockNum = stockNum;
	}
	public String getStockName() {
		return stockName;
	}
	public void setStockName(String stockName) {
		this.stockName = stockName;
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
