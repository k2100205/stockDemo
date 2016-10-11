package cn.cjq.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
@Service
public class YahooStock  {
	private static Logger logger = LogManager.getLogger(YahooStock.class);
	@SuppressWarnings("deprecation")
	public List<String> getStockInfo(String stockNum,Timestamp startDate,Timestamp endDate) { 
		List<String> list= new ArrayList<String>();
        URL ur = null; 
        String  url="http://table.finance.yahoo.com/table.csv?s="+stockNum; 
        if(startDate!=null){
			int startYear=startDate.getYear()+1900;
			int startMoon=startDate.getMonth();
			int startDay=startDate.getDate();
			url+="&c="+startYear;
			url+="&a="+startMoon;
			url+="&b="+startDay;
        }
        if(endDate!=null){
			int endYear=endDate.getYear()+1900;
			int endMoon=endDate.getMonth();
			int endDay=endDate.getDate();
			url+="&f="+endYear;
			url+="&d="+endMoon;
			url+="&e="+endDay;
        }
        try { 

            ur = new URL(url); 
            logger.info(url);
           
            URLConnection  uc =  ur.openConnection(); 
            String line=null;
            BufferedReader reader = null;
        	InputStreamReader	ins=null;
        	
        		uc.setConnectTimeout(100000);
        		uc.setReadTimeout(100000);
        	   	ins = new InputStreamReader(uc.getInputStream(), "UTF-8");
        	   	try {
        		 reader = new BufferedReader(ins);
    			while ( (line=reader.readLine()) != null) {
    				list.add(line);
    			}
    			if(list.size()>0){
    			 list.remove(0);
    			}
    			reader.close();
    			ins.close();
    	
    		} catch (IOException e) {
    			// TODO Auto-generated catch block
    			
    			e.printStackTrace();
    			ins.close();
    	
    			return null; 
    		}
    

        } catch (Exception e) { 

            // TODO Auto-generated catch block 

            e.printStackTrace(); 
   
        }
       
		return list; 

    }
}
