package cn.cjq.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cn.cjq.ibatis.tool.BeanMethod;

@Entity
@Table(name = "people") 
public class People implements Serializable {
	
	  @Column(name="id")
	  private Long id;
	  @Column(name="emp_id")
	  private String empId;
	  @Column(name="name")
	  private String name;
	  @Column(name="alt_name")
	  private String altName;
	  @Column(name="sex")
	  private String sex;
	  @Column(name="email")
	  private String email;
	  @Column(name="address")
	  private String address;
	  @Column(name="birthday")
	  private Timestamp birthday;
	  @Column(name="phone")
	  private String phone;
	  @Column(name="edu")
	  private String edu;
	  @Column(name="Id_card")
	  private String IdCard;
	  @Column(name="Iswork")
	  private String Iswork;
	  @Column(name="country")
	  private String country;
	  @Column(name="province")
	  private String province;
	  @Column(name="city")
	  private String city;
	  @Column(name="professional")
	  private String professional; 
	  @Column(name="nation")
	  private String nation;
	  @Column(name="instruction")
	  private String instruction; 
	  @Column(name="create_time")
	  private Timestamp createTime; 
	  @Column(name="create_people")
	  private String createPeople; 
	  @Column(name="update_time")
	  private Timestamp updateTime; 
	  @Column(name="update_people")
	  private String updatePeople;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getEmpId() {
		return empId;
	}
	public void setEmpId(String empId) {
		this.empId = empId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAltName() {
		return altName;
	}
	public void setAltName(String altName) {
		this.altName = altName;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Timestamp getBirthday() {
		return birthday;
	}
	public void setBirthday(Timestamp birthday) {
		this.birthday = birthday;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEdu() {
		return edu;
	}
	public void setEdu(String edu) {
		this.edu = edu;
	}
	public String getIdCard() {
		return IdCard;
	}
	public void setIdCard(String idCard) {
		IdCard = idCard;
	}
	public String getIswork() {
		return Iswork;
	}
	public void setIswork(String iswork) {
		Iswork = iswork;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getProfessional() {
		return professional;
	}
	public void setProfessional(String professional) {
		this.professional = professional;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getInstruction() {
		return instruction;
	}
	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	public String getCreatePeople() {
		return createPeople;
	}
	public void setCreatePeople(String createPeople) {
		this.createPeople = createPeople;
	}
	public Timestamp getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdatePeople() {
		return updatePeople;
	}
	public void setUpdatePeople(String updatePeople) {
		this.updatePeople = updatePeople;
	} 
	  
	  
	  




}
