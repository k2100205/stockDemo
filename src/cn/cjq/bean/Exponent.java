package cn.cjq.bean;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "exponent") 
public class Exponent implements Serializable {
	
	  @Column(name="STOCK_NAME")
	  private String stockName;
	  @Column(name="STOCK_NUM")
	  private String stockNum;
	  @Column(name="exponent_num")
	  private String exponentNum;
	  @Column(name="exponent_name")
	  private String exponentName;

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

	public String getExponentNum() {
		return exponentNum;
	}

	public void setExponentNum(String exponentNum) {
		this.exponentNum = exponentNum;
	}

	public String getExponentName() {
		return exponentName;
	}

	public void setExponentName(String exponentName) {
		this.exponentName = exponentName;
	}





}
