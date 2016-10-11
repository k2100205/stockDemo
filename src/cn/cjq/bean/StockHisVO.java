package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang.StringUtils;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "stock_his_info_v") 
public class StockHisVO implements Serializable,BeanMethod{

	private static final long serialVersionUID = 1L;


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
	 @Column(name="STOCK_NAME")
	  private String stockName;
	 @Column(name="STOCK_NUM")
	  private String stockNum;
	 @Column(name="STOCK_MARKET")
	  private String stockMarket;
	 @Column(name="20_DAY")
	  private Double day20;
	 @Column(name="5_DAY")
	  private Double day5;
	 @Column(name="10_DAY")
	  private Double day10;
	 @Column(name="60_DAY")
	  private Double day60;
	 @Column(name="120_DAY")
	  private Double day120;
	 @Column(name="250_DAY")
	  private Double day250;
	  private String startDate;
	  private String endDate;

	 
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
	@Override
	public List<String> setWhere() {
		List<String> wheres=new ArrayList<String>();
		if(StringUtils.isNotBlank(stockName)){
			wheres.add("stock_name ='"+stockName+"'");
		}
		if(StringUtils.isNotBlank(startDate)){
			Date date=new Date();
			DateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");   
		    try {
				date = sdf.parse(startDate);
			wheres.add("date >'"+new Timestamp(date.getTime())+"'");

			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}   

		}
		if(StringUtils.isNotBlank(endDate)){
			Date date=new Date();
			DateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");   
		    try {
				date = sdf.parse(endDate);
			wheres.add("date >'"+new Timestamp(date.getTime())+"'");

			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
		}
	return wheres;
	
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public Double getDay20() {
		return day20;
	}
	public void setDay20(Double day20) {
		this.day20 = day20;
	}
	public Double getDay5() {
		return day5;
	}
	public void setDay5(Double day5) {
		this.day5 = day5;
	}
	public Double getDay10() {
		return day10;
	}
	public void setDay10(Double day10) {
		this.day10 = day10;
	}
	public Double getDay60() {
		return day60;
	}
	public void setDay60(Double day60) {
		this.day60 = day60;
	}
	public Double getDay120() {
		return day120;
	}
	public void setDay120(Double day120) {
		this.day120 = day120;
	}
	public Double getDay250() {
		return day250;
	}
	public void setDay250(Double day250) {
		this.day250 = day250;
	}



	
}
