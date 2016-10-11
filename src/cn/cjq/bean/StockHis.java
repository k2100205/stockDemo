package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
@Entity
@Table(name = "stock_his") 
public class StockHis implements Serializable{

	private static final long serialVersionUID = 1L;
	 @Column(name="STOCK_ID")
	  private Long stockId;
	 @Column(name="DATE")
	  private Timestamp date;
	 @Column(name="OPEN")
	  private Double openPrice;
	 @Column(name="CLOSE")
	  private Double closePrice;
	 @Column(name="HIGH")
	  private Double highPrice;
	 @Column(name="LOW")
	  private Double lowPrice;
	 @Column(name="VOLUME")
	  private Long volume;
	 @Column(name="ADJ_CLOSE")
	  private Double adjClose;
	 @Column(name="CREATE_TIME")
	  private Timestamp createTime;
	 @Column(name="create_people")
	  private String createPeople;
	 
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

	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public Long getStockId() {
		return stockId;
	}
	public void setStockId(Long stockId) {
		this.stockId = stockId;
	}
	public String getCreatePeople() {
		return createPeople;
	}
	public void setCreatePeople(String createPeople) {
		this.createPeople = createPeople;
	}



	
}
