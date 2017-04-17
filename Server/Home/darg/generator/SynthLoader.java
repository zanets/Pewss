package darg.generator;
import java.util.List;
import java.util.ArrayList;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import javax.xml.xpath.XPathConstants;

public final class SynthLoader extends XMLoader implements ISynthLoader
{

	private XPath xpath = XPathFactory.newInstance().newXPath(); 
	private NodeList jobs = null;
	private Node job = null;
	
	public SynthLoader()
	{
		super();
	}

	public void open(String path) throws Exception
	{
		super.open(path);
		
		this.jobs = (NodeList) this.xpath
			.compile("/adag/job")
			.evaluate(
				this.getDocument(), 
				XPathConstants.NODESET
			);
	}

	public int cursor(int preCur)
	{
		if(this.jobs == null)
			return -1;

		this.job = this.jobs.item(preCur);	
		
		if(this.job == null)
			return -1;

		return preCur + 1;
	}

	public double getCpTime()
	{
		return Double.parseDouble(
			((Element) this.job).getAttribute("runtime")
		);
	} 

	public int getId()
	{
		return this.transId(
			((Element) this.job).getAttribute("id")
		);
	}	
	
	public int getLength()
	{
		return this.jobs == null 
			? 0 
			: this.jobs.getLength();
	}

	public String transId(int id)
	{
		return String.format("ID%05d", id);		
	}

	public int transId(String id)
	{
		return Integer.parseInt(
			id.substring(2)
		);
	}

	public List<Integer> getParent(int id) throws Exception
	{
		List<Integer> pats = new ArrayList<Integer>();
		NodeList _pats = (NodeList) this.xpath
			.compile("/adag/child[@ref='" + this.transId(id) + "']/parent")
			.evaluate(
				this.getDocument(), 
				XPathConstants.NODESET
			);
		
		if(_pats == null)
			return null;
		
		for(int i = 0; i<_pats.getLength(); i++)
		{
			Node pat = _pats.item(i);
			pats.add(
				this.transId(
					((Element)pat).getAttribute("ref")
				)
			);
		}
		return pats;
	}
}
