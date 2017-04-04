package darg.generator;

import java.util.List;
import java.util.ArrayList;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.NamedNodeMap;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import javax.xml.xpath.XPathConstants;

public class WFXMLoader extends XMLoader implements IWFXMLoader{


	public WFXMLoader(){
		super();
	}

	public int Cursor(int preCursor){
		try{
			XPathExpression expr = this.xPath.compile("/adag/job[" + preCursor + "]");
			this.node = (Node) expr.evaluate(this.doc, XPathConstants.NODE);
		} catch (Exception ex){
			ex.printStackTrace();
			return -1;
		}
		
		if(this.node == null)
			return -1;

		return preCursor + 1;
	}

	public double getCpTime(){
		String cp = this.node.getAttributes().getNamedItem("runtime").getNodeValue();
		return Double.parseDouble(cp);
	} 

	public String getId(){
		return this.node.getAttributes().getNamedItem("id").getNodeValue();
	}

	
}
