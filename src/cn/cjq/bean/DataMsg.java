package cn.cjq.bean;

import java.util.List;

import javax.persistence.Entity;
@Entity
public class DataMsg {
	//消息状态
	private String msgStatus="ERROR";
	//消息条数
	private Integer msgNum=1;
	//消息内容
	private String msgData="提交成功 稍等片刻刷新页面";
	public String getMsgStatus() {
		return msgStatus;
	}
	public void setMsgStatus(String msgStatus) {
		this.msgStatus = msgStatus;
	}

	public Integer getMsgNum() {
		return msgNum;
	}
	public void setMsgNum(Integer msgNum) {
		this.msgNum = msgNum;
	}
	public String getMsgData() {
		return msgData;
	}
	public void setMsgData(String msgData) {
		this.msgData = msgData;
	}
	
}
