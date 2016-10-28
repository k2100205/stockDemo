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
@Table(name = "company") 
public class Company implements Serializable {
	
	  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name="companyId")
	  private Long companyId;
	  @Column(name="com_name")
	  private String comName;
	  @Column(name="com_alt_name")
	  private String comAltName;
	  @Column(name="business_group")
	  private String businessGroup; 
	  @Column(name="country")
	  private String country; 
	  @Column(name="national_abbreviation")
	  private String nationalAbbreviation; 
	  @Column(name="province")
	  private String province; 
	  @Column(name="city")
	  private String city; 
	  @Column(name="com_type")
	  private String comType; 
	  @Column(name="business_address1")
	  private String businessAddress1; 
	  @Column(name="business_address2")
	  private String businessAddress2; 
	  @Column(name="business_address3")
	  private String businessAddress3; 
	  @Column(name="business_address4")
	  private String businessAddress4; 
	  @Column(name="parent_company")
	  private String parentCompany; 
	  @Column(name="corporate_representative")
	  private String corporateRepresentative; 
	  @Column(name="registered_capital")
	  private String registeredCapital; 
	  @Column(name="management_scope")
	  private String managementScope; 
	  @Column(name="registration_time")
	  private Timestamp registrationTime; 
	  @Column(name="registration_year")
	  private Long registrationYear; 
	  @Column(name="post_code")
	  private String postCode; 
	  @Column(name="ceo_name")
	  private String ceoName; 
	  @Column(name="ceo_id")
	  private String ceoId; 
	  @Column(name="ceo_job")
	  private String ceoJob; 
	  @Column(name="chairman")
	  private String chairman; 
	  @Column(name="chairmanId")
	  private String chairmanId; 
	  @Column(name="business_licence")
	  private String businessLicence; 
	  @Column(name="create_time")
	  private Timestamp create_time; 
	  @Column(name="update_time")
	  private Timestamp updateTime;
	  @Column(name="create_people")
	  private String createPeople; 
	  @Column(name="update_people")
	  private String updatePeople; 
	  @Column(name="status")
	  private String status;
	public Long getCompanyId() {
		return companyId;
	}
	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}
	public String getComName() {
		return comName;
	}
	public void setComName(String comName) {
		this.comName = comName;
	}
	public String getComAltName() {
		return comAltName;
	}
	public void setComAltName(String comAltName) {
		this.comAltName = comAltName;
	}
	public String getBusinessGroup() {
		return businessGroup;
	}
	public void setBusinessGroup(String businessGroup) {
		this.businessGroup = businessGroup;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getNationalAbbreviation() {
		return nationalAbbreviation;
	}
	public void setNationalAbbreviation(String nationalAbbreviation) {
		this.nationalAbbreviation = nationalAbbreviation;
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
	public String getComType() {
		return comType;
	}
	public void setComType(String comType) {
		this.comType = comType;
	}
	public String getBusinessAddress1() {
		return businessAddress1;
	}
	public void setBusinessAddress1(String businessAddress1) {
		this.businessAddress1 = businessAddress1;
	}
	public String getBusinessAddress2() {
		return businessAddress2;
	}
	public void setBusinessAddress2(String businessAddress2) {
		this.businessAddress2 = businessAddress2;
	}
	public String getBusinessAddress3() {
		return businessAddress3;
	}
	public void setBusinessAddress3(String businessAddress3) {
		this.businessAddress3 = businessAddress3;
	}
	public String getBusinessAddress4() {
		return businessAddress4;
	}
	public void setBusinessAddress4(String businessAddress4) {
		this.businessAddress4 = businessAddress4;
	}
	public String getParentCompany() {
		return parentCompany;
	}
	public void setParentCompany(String parentCompany) {
		this.parentCompany = parentCompany;
	}
	public String getCorporateRepresentative() {
		return corporateRepresentative;
	}
	public void setCorporateRepresentative(String corporateRepresentative) {
		this.corporateRepresentative = corporateRepresentative;
	}
	public String getRegisteredCapital() {
		return registeredCapital;
	}
	public void setRegisteredCapital(String registeredCapital) {
		this.registeredCapital = registeredCapital;
	}
	public String getManagementScope() {
		return managementScope;
	}
	public void setManagementScope(String managementScope) {
		this.managementScope = managementScope;
	}
	public Timestamp getRegistrationTime() {
		return registrationTime;
	}
	public void setRegistrationTime(Timestamp registrationTime) {
		this.registrationTime = registrationTime;
	}
	public Long getRegistrationYear() {
		return registrationYear;
	}
	public void setRegistrationYear(Long registrationYear) {
		this.registrationYear = registrationYear;
	}
	public String getPostCode() {
		return postCode;
	}
	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}
	public String getCeoName() {
		return ceoName;
	}
	public void setCeoName(String ceoName) {
		this.ceoName = ceoName;
	}
	public String getCeoId() {
		return ceoId;
	}
	public void setCeoId(String ceoId) {
		this.ceoId = ceoId;
	}
	public String getCeoJob() {
		return ceoJob;
	}
	public void setCeoJob(String ceoJob) {
		this.ceoJob = ceoJob;
	}
	public String getChairman() {
		return chairman;
	}
	public void setChairman(String chairman) {
		this.chairman = chairman;
	}
	public String getChairmanId() {
		return chairmanId;
	}
	public void setChairmanId(String chairmanId) {
		this.chairmanId = chairmanId;
	}
	public String getBusinessLicence() {
		return businessLicence;
	}
	public void setBusinessLicence(String businessLicence) {
		this.businessLicence = businessLicence;
	}
	public Timestamp getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}
	public Timestamp getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
	public String getCreatePeople() {
		return createPeople;
	}
	public void setCreatePeople(String createPeople) {
		this.createPeople = createPeople;
	}
	public String getUpdatePeople() {
		return updatePeople;
	}
	public void setUpdatePeople(String updatePeople) {
		this.updatePeople = updatePeople;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	} 
	


}
