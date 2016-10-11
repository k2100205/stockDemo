package cn.cjq.bean;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

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
  
  private List<TreeVO> treeNsode;
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
public List<TreeVO> getTreeNsode() {
	return treeNsode;
}
public void setTreeNsode(List<TreeVO> treeNsode) {
	this.treeNsode = treeNsode;
}
@Override
public List<String> setWhere() {
	// TODO Auto-generated method stub
	return null;
}
  
}
