package darg.generator; 

import java.util.List;
import java.util.ArrayList;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.NamedNodeMap;

public class MontageXMLoader extends XMLoader{

    

}

// only used for storing job's data in Montage XML
class MXJob{
    public String id = null
    public String name = null;
    public double runtime = 0;
    public List[] parents = null; 

    public MXJob(){}

    public void build(Node){
        
    }
}
