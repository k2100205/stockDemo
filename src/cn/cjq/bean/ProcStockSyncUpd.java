package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.sql.Types;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.OutParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_stock_sync_upd")
public class ProcStockSyncUpd implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	  @InParam(index = 1)
	  private String syncStatus;
	  @InParam(index = 2)
	  private Timestamp  syncTime;
	  @InParam(index = 3)
	  private String stockNum;
	
	  @OutParam(index = 4, type = Types.VARCHAR)
	  private String msg;
	  @OutParam(index = 5, type = Types.VARCHAR)
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

	public String getSyncStatus() {
		return syncStatus;
	}
	public void setSyncStatus(String syncStatus) {
		this.syncStatus = syncStatus;
	}
	public Timestamp getSyncTime() {
		return syncTime;
	}
	public void setSyncTime(Timestamp syncTime) {
		this.syncTime = syncTime;
	}

  
}
