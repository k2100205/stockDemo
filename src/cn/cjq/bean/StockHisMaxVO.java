package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;
import cn.cjq.procedure.InParam;
import cn.cjq.procedure.ProcedureDefine;
@Entity
@Table(name = "stock_his_maxdate_v") 
public class StockHisMaxVO implements Serializable,BeanMethod{

	private static final long serialVersionUID = 1L;
	 @Column(name="STOCK_ID")
	  private Long stockId;
	 @Column(name="DATE")
	  private Timestamp date;
	 @Column(name="STOCK_NUM")
	  private String stockNum;
	public Long getStockId() {
		return stockId;
	}
	public void setStockId(Long stockId) {
		this.stockId = stockId;
	}
	public Timestamp getDate() {
		return date;
	}
	public void setDate(Timestamp date) {
		this.date = date;
	}
	@Override
	public List<String> setWhere() {
		List<String> wheres=new ArrayList<String>();
		if(stockId!=null){
			wheres.add("stock_id ="+stockId);
		}
	return wheres;
	}
	public String getStockNum() {
		return stockNum;
	}
	public void setStockNum(String stockNum) {
		this.stockNum = stockNum;
	}
	

	
}
