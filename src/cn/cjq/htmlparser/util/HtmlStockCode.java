package cn.cjq.htmlparser.util;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.Tag;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.filters.OrFilter;
import org.htmlparser.Text;
import org.htmlparser.tags.LinkTag;
import org.htmlparser.tags.TableColumn;
import org.htmlparser.tags.TableRow;
import org.htmlparser.tags.TableTag;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;

//本类创建用于HTML文件解释工具
public class HtmlStockCode {

	// 本方法用于提取某个html文档中内嵌的链接
	public static List<String> extractLinks(String url, LinkFilter filter) {
		List<String> msg = new ArrayList<String>();
		try {
			// 1、构造一个Parser，并设置相关的属性
			Parser parser = new Parser();
			 URL htmlURL = new URL(url);  
			  HttpURLConnection httpURLConnection = null;
			try {
				httpURLConnection = (HttpURLConnection) htmlURL.openConnection();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}  
			   httpURLConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36");
			   httpURLConnection.setRequestProperty("referer", "http://quote.eastmoney.com/stocklist.html");  

			   parser.setConnection(httpURLConnection);  
			parser.setEncoding("GB2312");
			

			// 2.1、自定义一个Filter，用于过滤<Tabl>标签
			NodeFilter frameNodeFilter = new NodeFilter() {
				@Override
				public boolean accept(Node node) {
					 if (node.getText().startsWith("div class=\"sltit\"")) {
						                         return true;
						                     } else {
						                         return false;
						                      }

				}
			};
			
			//2.2、创建第二个Filter，过滤<a>标签
			NodeFilter aNodeFilter = new NodeClassFilter(Text.class);
			
			//2.3、净土上述2个Filter形成一个组合逻辑Filter。
			OrFilter linkFilter = new OrFilter(new NodeClassFilter(
					                     LinkTag.class), aNodeFilter);

			//3、使用parser根据filter来取得所有符合条件的节点
			NodeList nodeList = parser.extractAllNodesThatMatch(linkFilter);
			
			//4、对取得的Node进行处理
			for(int i = 0; i<nodeList.size();i++){
				Node node = nodeList.elementAt(i);
				String linkURL = "";
			
				if(node instanceof Text){
					Text tag = (Text) nodeList.elementAt(i);  
					if(tag.toPlainTextString().trim().indexOf("(")>0){
						if(tag.toPlainTextString().trim().indexOf("var")<0 |
								tag.toPlainTextString().trim().indexOf(".")<0){
							if(tag.toPlainTextString().length()<15){
                	msg.add(tag.toPlainTextString().trim());
							}
						}
					}



				}
			
			}
			
		} catch (ParserException e) {
			e.printStackTrace();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return msg;
	}
}
