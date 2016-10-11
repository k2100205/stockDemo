package cn.cjq.bean;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "STOCK") 
public class Stock implements Serializable {
	
	  @Column(name="STOCK_NAME")
	  private String stockName;
	  @Column(name="STOCK_NUM")
	  private String stockNum;
	  @Column(name="STOCK_MARKET")
	  private String stockMarket;

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



}
