package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Types;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.OutParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_stock_info")
public class ProcStock implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@InParam(index = 1)
	  private String stockMarket;
	  @InParam(index = 2)
	  private String stockNum;
	  @InParam(index = 3)
	  private String stockName;
	  @OutParam(index = 4, type = Types.VARCHAR)
	  private String msg;
	  @OutParam(index = 5, type = Types.VARCHAR)
	  private String msgStatus;
	public String getStockMarket() {
		return stockMarket;
	}
	public void setStockMarket(String stockMarket) {
		this.stockMarket = stockMarket;
	}
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
