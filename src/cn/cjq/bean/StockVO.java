package cn.cjq.bean;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "stock_info_v") 
public class StockVO implements Serializable,BeanMethod {
	
	  @Column(name="stock_name")
	  private String stockName;
	  @Column(name="stock_num")
	  private String stockNum;
	  @Column(name="stock_market")
	  private String stockMarket;
	  @Column(name="id")
	  private Long stockId;
	  @Column(name="sync_status")
	  private String syncStatus;
	  @Column(name="sync_time")
	  private String syncTime;
	  
public String getSyncStatus() {
		return syncStatus;
	}

	public void setSyncStatus(String syncStatus) {
		this.syncStatus = syncStatus;
	}

	public String getSyncTime() {
		return syncTime;
	}

	public void setSyncTime(String syncTime) {
		this.syncTime = syncTime;
	}

public String getStockName() {
		return stockName;
	}

	public void setStockName(String stockName) {
		this.stockName = stockName;
	}

	public String getStockNum() {
		return stockNum;
	}

	public void setStockNum(String stockNum) {
		this.stockNum = stockNum;
	}

	public String getStockMarket() {
		return stockMarket;
	}

	public void setStockMarket(String stockMarket) {
		this.stockMarket = stockMarket;
	}

public Long getStockId() {
		return stockId;
	}

	public void setStockId(Long stockId) {
		this.stockId = stockId;
	}

@Override
public List<String> setWhere() {
	// TODO Auto-generated method stub
	return null;
}
  
}
