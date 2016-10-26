package cn.cjq.bean;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "panel") 
public class Panel implements Serializable {
	
	  @Column(name="panel_num")
	  private String panelNum;
	  @Column(name="title")
	  private String title;
	  @Column(name="iconCls")
	  private String iconCls;
	public String getPanelNum() {
		return panelNum;
	}
	public void setPanelNum(String panelNum) {
		this.panelNum = panelNum;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}





}
