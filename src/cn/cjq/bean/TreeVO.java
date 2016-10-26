package cn.cjq.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang.StringUtils;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "tree") 
public class TreeVO implements Serializable,BeanMethod {
  @Id
  @Column(name="id")
  private Long id;
  @Column(name="pid")
  private Long pid;
  @Column(name="text")
  private String text;
  @Column(name="icon_cls")
  private String iconCls;
  @Column(name="url")
  private String url;
  @Column(name="checked")
  private String checked ; 
  
  @Column(name="node_status")
  private String status ;
  
  @Column(name="panel_num")
  private String panelNum ;
  
  
  private List<TreeVO> children;
  
  
  
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public Long getPid() {
	return pid;
}
public void setPid(Long pid) {
	this.pid = pid;
}

public String getText() {
	return text;
}
public void setText(String text) {
	this.text = text;
}
public String getIconCls() {
	return iconCls;
}
public void setIconCls(String iconCls) {
	this.iconCls = iconCls;
}
public String getUrl() {
	return url;
}
public void setUrl(String url) {
	this.url = url;
}

public String getChecked() {
	return checked;
}
public void setChecked(String checked) {
	this.checked = checked;
}
public String getStatus() {
	return status;
}
public void setStatus(String status) {
	this.status = status;
}

public List<TreeVO> getChildren() {
	return children;
}
public void setChildren(List<TreeVO> children) {
	this.children = children;
}

public String getPanelNum() {
	return panelNum;
}
public void setPanelNum(String panelNum) {
	this.panelNum = panelNum;
}
@Override
public List<String> setWhere() {
	List<String> wheres=new ArrayList<String>();
	if(StringUtils.isNotBlank(panelNum)){
		wheres.add("panel_num ='"+panelNum+"'");	}
	if(pid!=null){
		wheres.add("pid ="+pid);
	}
	return wheres;
}
  
}
