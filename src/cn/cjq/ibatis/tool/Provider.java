package cn.cjq.ibatis.tool;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import javax.persistence.Column;
import javax.persistence.Table;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.github.pagehelper.StringUtil;

public class Provider {
	private static Logger logger = Logger.getLogger(Provider.class);
	public String select(Map<String, Object> para) throws Exception {
		Object obj = para.get("TABLE");
		if (obj == null) {
			throw new RuntimeException("请传入含有key='TABLE',value=Object的HashMap");
		}
		Table tb = null;
		if (!obj.getClass().isAnnotationPresent(Table.class)) {
			throw new RuntimeException("JavaBean必须指定table类");
		} else {
			tb = obj.getClass().getAnnotation(Table.class);
		}
		String sql = "select ";
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field f : fields) {
			Column col = f.getAnnotation(Column.class);
			if (col != null) {
				sql += col.name() + " as " + f.getName() + ",";
			}
		}
		sql = sql.substring(0, sql.length() - 1);
		String TableName = tb.name();
		sql += " from " + TableName+" where 1=1 ";

              try{
			  Method m = obj.getClass().getMethod("setWhere");
	             @SuppressWarnings("unchecked")
				List<String> list=(List<String>) m.invoke(obj);
	             if(list!=null){
	             for(String s:list){
	            	 sql+=" and "+s;
	             }
	             }
              }
              catch(Exception e){
            	  
              }
	     		String  orderBy =  (String) para.get("ORDER_BY");
	    		if (StringUtils.isNotBlank(orderBy)) {
	    			sql +=" order by ";
	    			String[] oun=orderBy.split(",");
	    			for(String ou:oun){
	    				String[] un=ou.split(" ");
	    				
	    				for (Field f : fields) {
	    					Column col = f.getAnnotation(Column.class);
	    					if (un[0].equals(f.getName()) ) {
	    						sql +=col.name()+" ";
	    						if(un.length>1){
		    						sql +=un[1]+",";
		    						}
		    					}
	    					}
	    					
	    			}
	    			
	    			sql=sql.substring(0, sql.length() - 1);
	    		}
                
	     		Integer  page =  (Integer) para.get("PAGE");
	     		Integer  pageSize =  (Integer) para.get("PAGE_SIZE");
	    		if (page != null&&pageSize!=null) {
	    			sql+=" limit "+(page-1)*pageSize+","+pageSize;
	    		}
	    logger.info(("sql:"+sql));
		return sql;
	}
	public String  total (Map<String, Object> para) throws Exception {
		Object obj = para.get("TABLE");
		if (obj == null) {
			throw new RuntimeException("请传入含有key='TABLE',value=Object的HashMap");
		}
		Table tb = null;
		if (!obj.getClass().isAnnotationPresent(Table.class)) {
			throw new RuntimeException("JavaBean必须指定table类");
		} else {
			tb = obj.getClass().getAnnotation(Table.class);
		}
	
		String TableName = tb.name();
		String sql = "select count(1) from " + TableName+" where 1=1 ";
        try{
			  Method m = obj.getClass().getMethod("setWhere");
	             @SuppressWarnings("unchecked")
				List<String> list=(List<String>) m.invoke(obj);
	             if(list!=null){
	             for(String s:list){
	            	 sql+=" and "+s;
	             }
	             }
        }catch(Exception e){
        	
        }
	     	
	    logger.info(("sql:"+sql));
		return sql;
	}
	
	public String  maxOrMin (Map<String, Object> para) throws Exception {
		Object obj = para.get("TABLE");
		if (obj == null) {
			throw new RuntimeException("请传入含有key='TABLE',value=Object的HashMap");
		}
		Table tb = null;
		if (!obj.getClass().isAnnotationPresent(Table.class)) {
			throw new RuntimeException("JavaBean必须指定table类");
		} else {
			tb = obj.getClass().getAnnotation(Table.class);
		}
		Object max = para.get("MAX");
		Object min = para.get("MIN");
		if (max == null && min==null) {
			throw new RuntimeException("请传入含有key='MAX'or key='MIN',value=Object的HashMap");
		}
		String sql = "select ";
		
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field f : fields) {
			Column col = f.getAnnotation(Column.class);
			if (max != null&&max.equals(f.getName()) ) {
				sql +="max(t."+col.name()+"),";
				}
			if (min != null&&min.equals(f.getName()) ) {
				sql +="min(t."+col.name()+"),";
				}
			}
		sql=sql.substring(0, sql.length() - 1);
		String TableName = tb.name();
		 sql += " from (select * from "+TableName+" where 1=1 ";
        try{
			  Method m = obj.getClass().getMethod("setWhere");
	             @SuppressWarnings("unchecked")
				List<String> list=(List<String>) m.invoke(obj);
	             if(list!=null){
	             for(String s:list){
	            	 sql+=" and "+s;
	             }
	             }
        }catch(Exception e){
        	
        }
    	String  orderBy =  (String) para.get("ORDER_BY");
		if (StringUtils.isNotBlank(orderBy)) {
			sql +=" order by ";
			String[] oun=orderBy.split(",");
			for(String ou:oun){
				String[] un=ou.split(" ");
				
				for (Field f : fields) {
					Column col = f.getAnnotation(Column.class);
					if (un[0].equals(f.getName()) ) {
						sql +=col.name()+" ";
						if(un.length>1){
    						sql +=un[1]+",";
    						}
    					}
					}
					
			}
			
			sql=sql.substring(0, sql.length() - 1);
		}
        
        
 		Integer  page =  (Integer) para.get("PAGE");
 		Integer  pageSize =  (Integer) para.get("PAGE_SIZE");
		if (page != null&&pageSize!=null) {
			sql+=" limit "+(page-1)*pageSize+","+pageSize;
		}
		sql+=") t";
	    logger.info(("sql:"+sql));
		return sql;
	}
	
	public String insert(Map<String, Object> para) throws Exception {
		Object obj = para.get("TABLE");
		if (obj == null) {
			throw new RuntimeException("请传入含有key='TABLE',value=Object的HashMap");
		}
		Table tb = null;
		if (!obj.getClass().isAnnotationPresent(Table.class)) {
			throw new RuntimeException("JavaBean必须指定table类");
		} else {
			tb = obj.getClass().getAnnotation(Table.class);
		}
		String sql = "insert into ( ";
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field f : fields) {
			Column col = f.getAnnotation(Column.class);
			if (col != null) {
				sql += col.name() + ",";
			}
		}
		sql = sql.substring(0, sql.length() - 1);
		String TableName = tb.name();
		sql += " ) values(";
		for (Field f : fields) {
			Column col = f.getAnnotation(Column.class);
			if (col != null) {
				  String name = f.getName().replaceFirst(f.getName().substring(0, 1), f.getName().substring(0, 1)
		                     .toUpperCase());
				  Method m = obj.getClass().getMethod("get" + name);
		             Object om=m.invoke(obj);
		             if(om!=null){
		             }
			}
		}
		
		sql +=")";

		
	    logger.info(("sql:"+sql));
		return sql;
	}
}
