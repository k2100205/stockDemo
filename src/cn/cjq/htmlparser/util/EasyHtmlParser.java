package cn.cjq.htmlparser.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.nodes.TagNode;
import org.htmlparser.nodes.TextNode;
import org.htmlparser.tags.Div;
import org.htmlparser.tags.ImageTag;
import org.htmlparser.tags.LinkTag;
import org.htmlparser.tags.ParagraphTag;
import org.htmlparser.tags.ScriptTag;
import org.htmlparser.tags.SelectTag;
import org.htmlparser.tags.Span;
import org.htmlparser.tags.StyleTag;
import org.htmlparser.tags.TableColumn;
import org.htmlparser.tags.TableHeader;
import org.htmlparser.tags.TableRow;
import org.htmlparser.tags.TableTag;
import org.htmlparser.tags.TitleTag;
import org.htmlparser.util.NodeIterator;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;



public class EasyHtmlParser implements Parsable {
	
	 protected static final String lineSign = System.getProperty(
     "line.separator");
	 protected static final int lineSign_size = lineSign.length();

	
	private File file ;
	
	private String content ;
	private String summary ;
	private String title ;
	private String  url ;
	

	
	public EasyHtmlParser(String url) {
		this.url = url ;
	}
	
	public String getString() {
		try {
			
			URL ur = new URL(url); 
            HttpURLConnection uc = (HttpURLConnection) ur.openConnection(); 
            BufferedReader br = new BufferedReader(new InputStreamReader(ur.openStream(),"UTF-8")); 	
			String html = "" ;
			String str = null ;
			while ((str = br.readLine())!= null ) {
				html += str ;
			}
			return html ;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null ;
	}
	
	
	public synchronized   String getContent() {
		if (content != null ) {
			return content ;
		}
		String html = this.getString() ;
		Parser parser = new Parser() ;
		 
		try {
			 parser.setInputHTML(html) ;
			 for (NodeIterator e = parser.elements(); e.hasMoreNodes();){
				       Node node = (Node) e.nextNode();
				 
		            	
	                	PageContent context = new PageContent();
	                    context.setNumber(0);
	                    context.setTextBuffer(new StringBuffer());
	                    //抓取出内容
	                    extractHtml(node, context, "");

	                    StringBuffer testContext = context.getTextBuffer();
	   //System.out.println(testContext);
	                    content = testContext.toString() ;
				  
			 }
			 
					if (content == null ) {
			        	content = "" ;
			        }
	                
	        			summary = content ;
	     
	                NodeFilter filter = new NodeClassFilter(TitleTag.class) ;
	                parser.reset() ;
	                NodeList titleNodes = parser.extractAllNodesThatMatch(filter) ;
	                if (titleNodes != null && titleNodes.elementAt(0) != null){
	                	title = titleNodes.elementAt(0).toPlainTextString() ;
	                }else{
	                	title = "" ;
	                }
	                
	              /*  System.out.println(file.getAbsolutePath()+"   "+"title:"+title);
	        		System.out.println(file.getAbsolutePath()+"   "+"content:"+content);
	        		System.out.println(file.getAbsolutePath()+"   "+"summary:"+summary); 
					*/
		} catch (ParserException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	
		return content;
	}

	public String getSummary() {
		if (summary != null) {
			return summary ;
		}
		if (content == null ) {
			getContent() ; 			
		}
		return summary;
	}

	public String getTitle() {
		if (title != null) {
			return title ;
		}
		if (content == null ) {
			getContent() ; 			
		}
		
		
		return "";
	}
	
    protected List extractHtml(Node nodeP, PageContent pageContent, String siteUrl) throws Exception {
	    NodeList nodeList = nodeP.getChildren();
	    boolean bl = false;
	
	    if ((nodeList == null) || (nodeList.size() == 0)) {
	        if (nodeP instanceof ParagraphTag) {
	            ArrayList tableList = new ArrayList();
	            StringBuffer temp = new StringBuffer();
	            tableList.add(temp);
	            temp = new StringBuffer();
	            tableList.add(temp);
	
	            return tableList;
	        }
	
	        return null;
	    }
	
	    if ((nodeP instanceof TableTag) || (nodeP instanceof Div)) {
	        bl = true;
	    }
	
	    if (nodeP instanceof ParagraphTag) {
	        ArrayList tableList = new ArrayList();
	        StringBuffer temp = new StringBuffer();
	        tableList.add(temp);
	        extractParagraph(nodeP, siteUrl, tableList);
	
	        temp = new StringBuffer();
	
	        tableList.add(temp);
	
	        return tableList;
	    }
	
	    ArrayList tableList = new ArrayList();
	
	    try {
	        for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	            Node node = (Node) e.nextNode();
	
	            if (node instanceof LinkTag) {
	                tableList.add(node);
	                setLinkImg(node, siteUrl);
	            } else if (node instanceof ImageTag) {
	                ImageTag img = (ImageTag) node;
	
	                if (img.getImageURL().toLowerCase().indexOf("http://") < 0) {
	                    img.setImageURL(siteUrl + img.getImageURL());
	                } else {
	                    img.setImageURL(img.getImageURL());
	                }
	
	                tableList.add(node);
	            } else if (node instanceof ScriptTag ||
	                    node instanceof StyleTag || node instanceof SelectTag) {
	            } else if (node instanceof TextNode) {
	                if (node.getText().length() > 0) {
	                    StringBuffer temp = new StringBuffer();
	                    String text = collapse(node.getText()
	                                               .replaceAll("&nbsp;", "")
	                                               .replaceAll("　", ""));
	
	                    temp.append(text.trim());
	
	                    tableList.add(temp);
	                }
	            } else {
	                if (node instanceof TableTag || node instanceof Div) {
	                    TableValid tableValid = new TableValid();
	                    isValidTable(node, tableValid);
	
	                    if (tableValid.getTrnum() > 2) {
	                        tableList.add(node);
	
	                        continue;
	                    }
	                }
	
	                List tempList = extractHtml(node, pageContent, siteUrl);
	
	                if ((tempList != null) && (tempList.size() > 0)) {
	                    Iterator ti = tempList.iterator();
	
	                    while (ti.hasNext()) {
	                        tableList.add(ti.next());
	                    }
	                }
	            }
	        }
	    } catch (Exception e) {
	        return null;
	    }
	
	    if ((tableList != null) && (tableList.size() > 0)) {
	        if (bl) {
	            StringBuffer temp = new StringBuffer();
	            Iterator ti = tableList.iterator();
	            int wordSize = 0;
	            StringBuffer node;
	            int status = 0;
	            StringBuffer lineStart = new StringBuffer(
	                    "<p style=\"TEXT-INDENT: 2em\">");
	            StringBuffer lineEnd = new StringBuffer("</p>" + lineSign);
	
	            while (ti.hasNext()) {
	                Object k = ti.next();
	
	                if (k instanceof LinkTag) {
	                    if (status == 0) {
	                        temp.append(lineStart);
	                        status = 1;
	                    }
	
	                    node = new StringBuffer(((LinkTag) k).toHtml());
	                    temp.append(node);
	                } else if (k instanceof ImageTag) {
	                    if (status == 0) {
	                        temp.append(lineStart);
	                        status = 1;
	                    }
	
	                    node = new StringBuffer(((ImageTag) k).toHtml());
	                    temp.append(node);
	                } else if (k instanceof TableTag) {
	                    if (status == 0) {
	                        temp.append(lineStart);
	                        status = 1;
	                    }
	
	                    node = new StringBuffer(((TableTag) k).toHtml());
	                    temp.append(node);
	                } else if (k instanceof Div) {
	                    if (status == 0) {
	                        temp.append(lineStart);
	                        status = 1;
	                    }
	
	                    node = new StringBuffer(((Div) k).toHtml());
	                    temp.append(node);
	                } else {
	                    node = (StringBuffer) k;
	
	                    if (status == 0) {
	                        if (node.indexOf("<p") < 0) {
	                            temp.append(lineStart);
	                            temp.append(node);
	                            wordSize = wordSize + node.length();
	                            status = 1;
	                        } else {
	                            temp.append(node);
	                            status = 1;
	                        }
	                    } else if (status == 1) {
	                        if (node.indexOf("</p") < 0) {
	                            if (node.indexOf("<p") < 0) {
	                                temp.append(node);
	                                wordSize = wordSize + node.length();
	                            } else {
	                                temp.append(lineEnd);
	                                temp.append(node);
	                                status = 1;
	                            }
	                        } else {
	                            temp.append(node);
	                            status = 0;
	                        }
	                    }
	                }
	            }
	
	            if (status == 1) {
	                temp.append(lineEnd);
	            }
	
	            if (wordSize > pageContent.getNumber()) {
	                pageContent.setNumber(wordSize);
	                pageContent.setTextBuffer(temp);
	            }
	
	            return null;
	        } else {
	            return tableList;
	        }
	    }
	
	    return null;
}
	
	
	/**
	    * 提取段落中的内容
	    * @param nodeP
	    * @param siteUrl
	    * @param tableList
	    * @return
	    */
	    private List extractParagraph(Node nodeP, String siteUrl, List tableList) {
	        NodeList nodeList = nodeP.getChildren();

	        if ((nodeList == null) || (nodeList.size() == 0)) {
	            if (nodeP instanceof ParagraphTag) {
	                StringBuffer temp = new StringBuffer();
	                temp.append("<p style=\"TEXT-INDENT: 2em\">");
	                tableList.add(temp);
	                temp = new StringBuffer();
	                temp.append("</p>").append(lineSign);
	                tableList.add(temp);

	                return tableList;
	            }

	            return null;
	        }

	        try {
	            for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	                Node node = (Node) e.nextNode();

	                if (node instanceof ScriptTag || node instanceof StyleTag ||
	                        node instanceof SelectTag) {
	                } else if (node instanceof LinkTag) {
	                    tableList.add(node);
	                    setLinkImg(node, siteUrl);
	                } else if (node instanceof ImageTag) {
	                    ImageTag img = (ImageTag) node;

	                    if (img.getImageURL().toLowerCase().indexOf("http://") < 0) {
	                        img.setImageURL(siteUrl + img.getImageURL());
	                    } else {
	                        img.setImageURL(img.getImageURL());
	                    }

	                    tableList.add(node);
	                } else if (node instanceof TextNode) {
	                    if (node.getText().trim().length() > 0) {
	                        String text = collapse(node.getText()
	                                                   .replaceAll("&nbsp;", "")
	                                                   .replaceAll("　", ""));
	                        StringBuffer temp = new StringBuffer();
	                        temp.append(text);
	                        tableList.add(temp);
	                    }
	                } else if (node instanceof Span) {
	                    StringBuffer spanWord = new StringBuffer();
	                    getSpanWord(node, spanWord);

	                    if ((spanWord != null) && (spanWord.length() > 0)) {
	                        String text = collapse(spanWord.toString()
	                                                       .replaceAll("&nbsp;", "")
	                                                       .replaceAll("　", ""));

	                        StringBuffer temp = new StringBuffer();
	                        temp.append(text);
	                        tableList.add(temp);
	                    }
	                } else if (node instanceof TagNode) {
	                    String tag = node.toHtml();

	                    if (tag.length() <= 10) {
	                        tag = tag.toLowerCase();

	                        if ((tag.indexOf("strong") >= 0) ||
	                                (tag.indexOf("b") >= 0)) {
	                            StringBuffer temp = new StringBuffer();
	                            temp.append(tag);
	                            tableList.add(temp);
	                        }
	                    } else {
	                        if (node instanceof TableTag || node instanceof Div) {
	                            TableValid tableValid = new TableValid();
	                            isValidTable(node, tableValid);

	                            if (tableValid.getTrnum() > 2) {
	                                tableList.add(node);

	                                continue;
	                            }
	                        }

	                        extractParagraph(node, siteUrl, tableList);
	                    }
	                }
	            }
	        } catch (Exception e) {
	            return null;
	        }

	        return tableList;
	    }
	    
	    
	    protected void getSpanWord(Node nodeP, StringBuffer spanWord) {
	        NodeList nodeList = nodeP.getChildren();

	        try {
	            for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	                Node node = (Node) e.nextNode();

	                if (node instanceof ScriptTag || node instanceof StyleTag ||
	                        node instanceof SelectTag) {
	                } else if (node instanceof TextNode) {
	                    spanWord.append(node.getText());
	                } else if (node instanceof Span) {
	                    getSpanWord(node, spanWord);
	                } else if (node instanceof ParagraphTag) {
	                    getSpanWord(node, spanWord);
	                } else if (node instanceof TagNode) {
	                    String tag = node.toHtml().toLowerCase();

	                    if (tag.length() <= 10) {
	                        if ((tag.indexOf("strong") >= 0) ||
	                                (tag.indexOf("b") >= 0)) {
	                            spanWord.append(tag);
	                        }
	                    }
	                }
	            }
	        } catch (Exception e) {
	        }

	        return;
	    }

	    /**
	    * 判断TABLE是否是表单
	    * @param nodeP
	    * @return
	    */
	    private void isValidTable(Node nodeP, TableValid tableValid) {
	        NodeList nodeList = nodeP.getChildren();

	        /**如果该表单没有子节点则返回**/
	        if ((nodeList == null) || (nodeList.size() == 0)) {
	            return;
	        }

	        try {
	            for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	                Node node = (Node) e.nextNode();

	                /**如果子节点本身也是表单则返回**/
	                if (node instanceof TableTag || node instanceof Div) {
	                    return;
	                } else if (node instanceof ScriptTag ||
	                        node instanceof StyleTag || node instanceof SelectTag) {
	                    return;
	                } else if (node instanceof TableColumn) {
	                    return;
	                } else if (node instanceof TableRow) {
	                    TableColumnValid tcValid = new TableColumnValid();
	                    tcValid.setValid(true);
	                    findTD(node, tcValid);

	                    if (tcValid.isValid()) {
	                        if (tcValid.getTdNum() < 2) {
	                            if (tableValid.getTdnum() > 0) {
	                                return;
	                            } else {
	                                continue;
	                            }
	                        } else {
	                            if (tableValid.getTdnum() == 0) {
	                                tableValid.setTdnum(tcValid.getTdNum());
	                                tableValid.setTrnum(tableValid.getTrnum() + 1);
	                            } else {
	                                if (tableValid.getTdnum() == tcValid.getTdNum()) {
	                                    tableValid.setTrnum(tableValid.getTrnum() +
	                                        1);
	                                } else {
	                                    return;
	                                }
	                            }
	                        }
	                    }
	                } else {
	                    isValidTable(node, tableValid);
	                }
	            }
	        } catch (Exception e) {
	            return;
	        }

	        return;
	    }

	    /**
	    * 判断是否有效TR
	    * @param nodeP
	    * @param TcValid
	    * @return
	    */
	    private void findTD(Node nodeP, TableColumnValid tcValid) {
	        NodeList nodeList = nodeP.getChildren();

	        /**如果该表单没有子节点则返回**/
	        if ((nodeList == null) || (nodeList.size() == 0)) {
	            return;
	        }

	        try {
	            for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	                Node node = (Node) e.nextNode();

	                /**如果有嵌套表单**/
	                if (node instanceof TableTag || node instanceof Div ||
	                        node instanceof TableRow ||
	                        node instanceof TableHeader) {
	                    tcValid.setValid(false);

	                    return;
	                } else if (node instanceof ScriptTag ||
	                        node instanceof StyleTag || node instanceof SelectTag) {
	                    tcValid.setValid(false);

	                    return;
	                } else if (node instanceof TableColumn) {
	                    tcValid.setTdNum(tcValid.getTdNum() + 1);
	                } else {
	                    findTD(node, tcValid);
	                }
	            }
	        } catch (Exception e) {
	            tcValid.setValid(false);

	            return;
	        }

	        return;
	    }

	    protected String collapse(String string) {
	        int chars;
	        int length;
	        int state;
	        char character;
	        StringBuffer buffer = new StringBuffer();
	        chars = string.length();

	        if (0 != chars) {
	            length = buffer.length();
	            state = ((0 == length) || (buffer.charAt(length - 1) == ' ') ||
	                ((lineSign_size <= length) &&
	                buffer.substring(length - lineSign_size, length).equals(lineSign)))
	                ? 0 : 1;

	            for (int i = 0; i < chars; i++) {
	                character = string.charAt(i);

	                switch (character) {
	                case '\u0020':
	                case '\u0009':
	                case '\u000C':
	                case '\u200B':
	                case '\u00a0':
	                case '\r':
	                case '\n':

	                    if (0 != state) {
	                        state = 1;
	                    }

	                    break;

	                default:

	                    if (1 == state) {
	                        buffer.append(' ');
	                    }

	                    state = 2;
	                    buffer.append(character);
	                }
	            }
	        }

	        return buffer.toString();
	    }
	    
	    
	    /**
	     * 设置图象连接
	     * @param nodeP
	     * @param siteUrl
	     */
	     private void setLinkImg(Node nodeP, String siteUrl) {
	         NodeList nodeList = nodeP.getChildren();

	         try {
	             for (NodeIterator e = nodeList.elements(); e.hasMoreNodes();) {
	                 Node node = (Node) e.nextNode();

	                 if (node instanceof ImageTag) {
	                     ImageTag img = (ImageTag) node;

	                     if (img.getImageURL().toLowerCase().indexOf("http://") < 0) {
	                         img.setImageURL(siteUrl + img.getImageURL());
	                     } else {
	                         img.setImageURL(img.getImageURL());
	                     }
	                 }
	             }
	         } catch (Exception e) {
	             return;
	         }

	         return;
	     }

}
