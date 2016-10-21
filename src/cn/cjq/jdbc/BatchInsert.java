package cn.cjq.jdbc;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Table;

import org.apache.log4j.Logger;

import cn.cjq.ibatis.tool.Provider;
/**
 * 数据库连接类
 * 说明:JDBC批量插入
 * @author CJQ
 *
 */
public class BatchInsert <T>  {
	private static Logger logger = Logger.getLogger(BatchInsert.class);

  public int batchInsert(List<T> list) throws Exception{
	  int ret=0;
	    if(list.size()>0){
	    	Table tb = null;
	    	Object obj =list.get(0);
			if (!obj.getClass().isAnnotationPresent(Table.class)) {
				throw new RuntimeException("JavaBean必须指定table类");
			} else {
				tb = obj.getClass().getAnnotation(Table.class);
			}
			StringBuffer sql= new StringBuffer("REPLACE INTO ").append(tb.name()).append(" (");
			Field[] fields = obj.getClass().getDeclaredFields();
			for (Field f : fields) {
				Column col = f.getAnnotation(Column.class);
				if (col != null) {
					sql.append(col.name()).append(",");
				}
			}
			sql= new StringBuffer(sql.substring(0, sql.length() - 1)).append(" ) VALUES ");
			for(T t :list){
				sql.append("(");
				Field[] fs = t.getClass().getDeclaredFields();
				for (Field f : fs) {
					Column col = f.getAnnotation(Column.class);
					if (col != null) {
						 String first = f.getName().substring(0, 1).toUpperCase();
						 String rest = f.getName().substring(1, f.getName().length());
						 String str ="get"+ new StringBuffer(first).append(rest).toString(); 
						 Method m = t.getClass().getMethod(str);
						 Object val= m.invoke(t);
						 if(val!=null){
							 if(f.getGenericType()==String.class || 
							    f.getGenericType()==Date.class||
							    f.getGenericType()==Timestamp.class
									 ){
								 sql.append("'") .append(val.toString()).append("',");
							 }else{
								 sql .append(val.toString()).append(",");

							 }
							
						 }else{
							 sql .append("null,");

						 }
					}
				}
				sql= new StringBuffer(sql.substring(0, sql.length() - 1)).append("),");
			}
			sql= new StringBuffer(sql.substring(0, sql.length() - 1));

		    logger.info(("sql:"+sql));
		    ConnectionDB c=new ConnectionDB();
		    Connection conn = c.getConnection();
		    conn.setAutoCommit(false);
		    PreparedStatement pstmt= (PreparedStatement) conn.prepareStatement(sql.toString());
		     ret= pstmt.executeUpdate();
		    
		     pstmt.close();
		     conn.commit();
		     conn.close();
	    }
	
	    return ret;
	  }
  }
