package cn.cjq.bean;


public class UserVO {

	private int id;
	private String age;
	private String userName;
	public UserVO(){
		super();
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public UserVO(int id, String age, String userName) {
		super();
		this.id = id;
		this.age = age;
		this.userName = userName;
	}
}
