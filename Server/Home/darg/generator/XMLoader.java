package darg.generator;

import java.io.File;
import java.lang.Exception;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;

public abstract class XMLoader{
	private DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	private DocumentBuilder db = null;
	private Document doc = null;
	private File file = null;

	public void open(String path) throws Exception {
		this.file = new File(path);
		this.db = this.dbf.newDocumentBuilder();
		this.doc = this.db.parse(this.file);
		this.doc.getDocumentElement().normalize();
	}

	public Document getDocument(){
		return this.doc;
	}

}
