package darg.generator; 

import java.io.File;
import java.lang.Exception;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

public class XMLoader{
	protected DocumentBuilderFactory dbf = null;
	protected DocumentBuilder db = null;
	protected Document doc = null;
	protected File file = null;
	protected String path = null;

	public XMLoader(String path){
		this.path = path;
		this.dbf = DocumentBuilderFactory.newInstance();
	}

	public void parse() throws Exception {
		this.file = new File(this.path);
		this.db = this.dbf.newDocumentBuilder();
		this.doc = this.db.parse(this.file);
		this.doc.getDocumentElement().normalize();
	}

	public NodeList getValueByTag(String tag) throws Exception{
		if(!this.isReady())
			throw new Exception("Null document");
		return this.doc.getElementsByTagName(tag);
	}

	public boolean isReady(){
		return this.doc != null;
	}
}