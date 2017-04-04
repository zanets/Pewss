package darg.generator;

import java.io.File;
import java.lang.Exception;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;



public abstract class XMLoader{
	protected DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	protected DocumentBuilder db = null;
	protected Document doc = null;
	protected File file = null;
	protected XPath xPath = XPathFactory.newInstance().newXPath(); 
	protected Node node = null;
	
	public void open(String path) throws Exception {
		this.file = new File(path);
		this.db = this.dbf.newDocumentBuilder();
		this.doc = this.db.parse(this.file);
		this.doc.getDocumentElement().normalize();
	}

	public boolean isReady(){
		return this.doc != null;
	}
}
