package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.ProcedureDefine;

@ProcedureDefine("proc_stock_his_ins")
public class ProcStockHisIns implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@InParam(index = 1)
	  private Long stockId;
	@InParam(index = 2)
	  private Timestamp date;
	@InParam(index = 3)
	  private Double openPrice;
	@InParam(index = 4)
	  private Double closePrice;
	@InParam(index = 5)
	  private Double highPrice;
	@InParam(index = 6)
	  private Double lowPrice;
	@InParam(index = 7)
	  private Long volume;
	@InParam(index = 8)
	  private Double adjClose;
	public Timestamp getDate() {
		return date;
	}
	public void setDate(Timestamp date) {
		this.date = date;
	}
	public Double getOpenPrice() {
		return openPrice;
	}
	public void setOpenPrice(Double openPrice) {
		this.openPrice = openPrice;
	}
	public Double getClosePrice() {
		return closePrice;
	}
	public void setClosePrice(Double closePrice) {
		this.closePrice = closePrice;
	}
	public Double getHighPrice() {
		return highPrice;
	}
	public void setHighPrice(Double highPrice) {
		this.highPrice = highPrice;
	}
	public Double getLowPrice() {
		return lowPrice;
	}
	public void setLowPrice(Double lowPrice) {
		this.lowPrice = lowPrice;
	}

	public Long getVolume() {
		return volume;
	}
	public void setVolume(Long volume) {
		this.volume = volume;
	}
	public Double getAdjClose() {
		return adjClose;
	}
	public void setAdjClose(Double adjClose) {
		this.adjClose = adjClose;
	}
	public Long getStockId() {
		return stockId;
	}
	public void setStockId(Long stockId) {
		this.stockId = stockId;
	}
	

	
}
