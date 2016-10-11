package cn.cjq.api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.stereotype.Service;
@Service
public class SinaStock  {
	public String getStockInfo() { 

        URL ur = null; 

        try { 

            ur = new URL("http://hq.sinajs.cn/list=sh601006"); 

            HttpURLConnection uc = (HttpURLConnection) ur.openConnection(); 

            BufferedReader reader = new BufferedReader(new InputStreamReader(ur.openStream(),"GBK")); 

            String line; 

            while((line = reader.readLine()) != null){ 
            	String[]ary=line.split("=");
            	ary[1]=ary[1].replaceAll("\"", "");
                return ary[1].replaceAll("\"", ""); 

            } 

        } catch (Exception e) { 

            // TODO Auto-generated catch block 

            e.printStackTrace(); 

        }
		return null; 

    }
}
